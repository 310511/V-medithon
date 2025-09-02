import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { infiniteMemoryAPI, MemoryAnalysis, Task, MemoryReport, EnhancedQueryResponse } from '@/services/infiniteMemoryApi';

interface InfiniteMemoryState {
  currentUserId: string | null;
  conversationHistory: Array<{
    id: string;
    timestamp: Date;
    type: 'user' | 'ai';
    content: string;
    analysis?: MemoryAnalysis;
    queryResponse?: EnhancedQueryResponse;
  }>;
  tasks: Task[];
  memoryReport: MemoryReport | null;
  isListening: boolean;
  isLoading: boolean;
  error: string | null;
}

type InfiniteMemoryAction =
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'ADD_CONVERSATION_ENTRY'; payload: { type: 'user' | 'ai'; content: string; analysis?: MemoryAnalysis; queryResponse?: EnhancedQueryResponse } }
  | { type: 'LOAD_CONVERSATION_HISTORY'; payload: Array<{ id: string; timestamp: Date; type: 'user' | 'ai'; content: string; analysis?: MemoryAnalysis; queryResponse?: EnhancedQueryResponse }> }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'SET_MEMORY_REPORT'; payload: MemoryReport }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Get initial user ID from localStorage
const getInitialUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('infinite_memory_user_id');
  }
  return null;
};

const initialState: InfiniteMemoryState = {
  currentUserId: getInitialUserId(),
  conversationHistory: [],
  tasks: [],
  memoryReport: null,
  isListening: false,
  isLoading: false,
  error: null,
};

function infiniteMemoryReducer(state: InfiniteMemoryState, action: InfiniteMemoryAction): InfiniteMemoryState {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, currentUserId: action.payload };
    case 'ADD_CONVERSATION_ENTRY':
      return {
        ...state,
        conversationHistory: [
          ...state.conversationHistory,
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: action.payload.type,
            content: action.payload.content,
            analysis: action.payload.analysis,
            queryResponse: action.payload.queryResponse,
          },
        ],
      };
    case 'LOAD_CONVERSATION_HISTORY':
      return {
        ...state,
        conversationHistory: action.payload,
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.task_id === action.payload ? { ...task, completed: true } : task
        ),
      };
    case 'SET_MEMORY_REPORT':
      return { ...state, memoryReport: action.payload };
    case 'SET_LISTENING':
      return { ...state, isListening: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface InfiniteMemoryContextType {
  state: InfiniteMemoryState;
  processText: (text: string) => Promise<void>;
  queryMemory: (query: string) => Promise<void>;
  queryMemoryWithGemini: (query: string, includeSummary?: boolean) => Promise<void>;
  processImage: (image: File, caption?: string) => Promise<void>;
  createTask: (task: Omit<Task, 'task_id' | 'created_at'>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  loadTasks: () => Promise<void>;
  loadMemoryReport: (days?: number) => Promise<void>;
  loadConversationHistory: () => Promise<void>;
  setUserId: (userId: string) => void;
  clearError: () => void;
}

const InfiniteMemoryContext = createContext<InfiniteMemoryContextType | undefined>(undefined);

export function InfiniteMemoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(infiniteMemoryReducer, initialState);

  const loadConversationHistory = async (userId?: string) => {
    const targetUserId = userId || state.currentUserId;
    if (!targetUserId) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await infiniteMemoryAPI.getConversationHistory(targetUserId);
      const conversations = response.conversations || [];
      
      // Convert backend conversation format to frontend format
      const formattedConversations = conversations.map((conv: any) => ({
        id: conv.id,
        timestamp: new Date(conv.created_at),
        type: conv.message_type,
        content: conv.content,
        analysis: undefined, // Analysis data is not stored in conversations table
      }));

      dispatch({ type: 'LOAD_CONVERSATION_HISTORY', payload: formattedConversations });
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load conversation history' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load conversation history when component mounts if user ID is already set
  useEffect(() => {
    if (state.currentUserId) {
      loadConversationHistory();
    }
  }, [state.currentUserId]);

  const setUserId = (userId: string) => {
    dispatch({ type: 'SET_USER_ID', payload: userId });
    // Save user ID to localStorage for persistence across page reloads
    if (typeof window !== 'undefined') {
      localStorage.setItem('infinite_memory_user_id', userId);
    }
    // Automatically load conversation history when user ID is set
    loadConversationHistory(userId);
  };

  const processText = async (text: string) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Add user message to conversation
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: { type: 'user', content: text },
      });

      // Process text through infinite memory
      const analysis = await infiniteMemoryAPI.processText({
        user_id: state.currentUserId,
        text,
      });

      // Add AI response to conversation
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: {
          type: 'ai',
          content: analysis.summary,
          analysis,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const queryMemory = async (query: string) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Add user query to conversation
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: { type: 'user', content: query },
      });

      // Query memory
      const response = await infiniteMemoryAPI.query({
        user_id: state.currentUserId,
        query,
      });

      // Add AI response to conversation with enhanced query response
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: {
          type: 'ai',
          content: response.final_answer,
          queryResponse: response,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const queryMemoryWithGemini = async (query: string, includeSummary: boolean = true) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Add user query to conversation
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: { type: 'user', content: query },
      });

      // Query memory with Gemini
      const response = await infiniteMemoryAPI.queryWithGemini({
        user_id: state.currentUserId,
        query,
        include_summary: includeSummary,
      });

      // Add AI response to conversation with enhanced query response
      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: {
          type: 'ai',
          content: response.final_answer,
          queryResponse: response,
        },
      });

      // Log summary if available
      if (response.summary) {
        console.log('📊 Gemini Summary:', response.summary);
      }

      // Log data points
      console.log('📈 Data Points:', response.data_points);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processImage = async (image: File, caption: string = '') => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const analysis = await infiniteMemoryAPI.processImage(state.currentUserId, image, caption);

      dispatch({
        type: 'ADD_CONVERSATION_ENTRY',
        payload: {
          type: 'ai',
          content: `Processed image: ${analysis.summary}`,
          analysis,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createTask = async (task: Omit<Task, 'task_id' | 'created_at'>) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const newTask = await infiniteMemoryAPI.createTask({
        patient_id: state.currentUserId,
        summary: task.summary,
        description: task.description,
        start_date: task.start_date,
        end_date: task.end_date,
      });

      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const completeTask = async (taskId: string) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      await infiniteMemoryAPI.completeTask({
        patient_id: state.currentUserId,
        task_id: taskId,
      });

      dispatch({ type: 'COMPLETE_TASK', payload: taskId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadTasks = async () => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const tasks = await infiniteMemoryAPI.getTasks(state.currentUserId);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMemoryReport = async (days: number = 3) => {
    if (!state.currentUserId) {
      dispatch({ type: 'SET_ERROR', payload: 'No user ID set' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const report = await infiniteMemoryAPI.getMemoryReport(state.currentUserId, days);
      dispatch({ type: 'SET_MEMORY_REPORT', payload: report });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: InfiniteMemoryContextType = {
    state,
    processText,
    queryMemory,
    queryMemoryWithGemini,
    processImage,
    createTask,
    completeTask,
    loadTasks,
    loadMemoryReport,
    loadConversationHistory,
    setUserId,
    clearError,
  };

  return (
    <InfiniteMemoryContext.Provider value={value}>
      {children}
    </InfiniteMemoryContext.Provider>
  );
}

export function useInfiniteMemory() {
  const context = useContext(InfiniteMemoryContext);
  if (context === undefined) {
    throw new Error('useInfiniteMemory must be used within an InfiniteMemoryProvider');
  }
  return context;
} 