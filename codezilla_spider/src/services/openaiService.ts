import { API_ENDPOINTS } from '@/config/api';

export interface AIMedicineRecommendation {
  symptom_analysis: string;
  recommendations: Array<{
    medicine_name: string;
    category: string;
    dosage: string;
    frequency: string;
    side_effects: string[];
    warnings: string[];
    confidence_score: number;
  }>;
  urgency_level: 'low' | 'medium' | 'high';
  medical_attention_needed: boolean;
  lifestyle_recommendations: string[];
  follow_up_advice: string;
}

export interface AIHealthConsultationResponse {
  success: boolean;
  response: string;
  timestamp: string;
  model_used: string;
  error?: string;
}

export interface AIMedicalTextAnalysis {
  symptoms: string[];
  potential_conditions: string[];
  recommended_actions: string[];
  urgency_level: 'low' | 'medium' | 'high';
  follow_up: string;
}

export interface AIMedicineRecommendationResponse {
  success: boolean;
  data: AIMedicineRecommendation;
  timestamp: string;
  user_id: string;
  error?: string;
}

export interface AIMedicalTextAnalysisResponse {
  success: boolean;
  analysis: AIMedicalTextAnalysis;
  timestamp: string;
  error?: string;
}

class OpenAIService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: any
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw error;
    }
  }

  async getMedicineRecommendations(
    symptoms: string,
    userId: string = 'default-user'
  ): Promise<AIMedicineRecommendationResponse> {
    return this.makeRequest<AIMedicineRecommendationResponse>(
      API_ENDPOINTS.AI_MEDICINE_RECOMMEND,
      'POST',
      {
        user_id: userId,
        symptoms,
        include_ai_analysis: true,
      }
    );
  }

  async getHealthConsultation(
    message: string,
    userId: string = 'default-user',
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<AIHealthConsultationResponse> {
    return this.makeRequest<AIHealthConsultationResponse>(
      API_ENDPOINTS.AI_HEALTH_CONSULTATION,
      'POST',
      {
        user_id: userId,
        message,
        conversation_history: conversationHistory,
      }
    );
  }

  async analyzeMedicalText(
    text: string,
    userId?: string
  ): Promise<AIMedicalTextAnalysisResponse> {
    return this.makeRequest<AIMedicalTextAnalysisResponse>(
      API_ENDPOINTS.AI_MEDICAL_TEXT_ANALYSIS,
      'POST',
      {
        text,
        user_id: userId,
      }
    );
  }
}

export const openAIService = new OpenAIService();
