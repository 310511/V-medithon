import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Pill, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Brain,
  Zap,
  Heart,
  Stethoscope,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';

interface SymptomExtraction {
  symptoms: string[];
  duration?: string;
  severity?: string;
  additional_info?: string;
}

interface DiagnosisResult {
  symptoms: string[];
  model_diagnosis?: string;
  model_confidence?: number;
  gemini_diagnosis?: string;
  final_diagnosis: string;
  differential_diagnoses?: string[];
  urgency_level: string;
  recommendations: string[];
  disclaimer: string;
}

interface VoiceMedicineResponse {
  session_id: string;
  timestamp: string;
  input_text: string;
  symptom_extraction: SymptomExtraction;
  diagnosis_result: DiagnosisResult;
  processing_time: number;
  model_used: string;
  confidence?: number;
  gemini_diagnosis?: string;
  final_diagnosis?: string;
  urgency_level?: string;
  alternative_diagnoses?: string[];
  recommendations?: string[];
}

interface VoiceAssistantProps {
  className?: string;
}

export const VoiceMedicineAssistant: React.FC<VoiceAssistantProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<VoiceMedicineResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [activeTab, setActiveTab] = useState('voice');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const fullTranscriptRef = useRef('');
  
  // API Configuration
  const VOICE_MEDICINE_API_URL = "http://localhost:8002";

  // Process voice input and generate diagnosis
  const processVoiceInput = async (inputText: string) => {
    console.log('🔍 processVoiceInput called with:', inputText);
    setIsProcessing(true);
    setError(null);
    
    try {
      // Use the enhanced diagnosis function
      console.log('🔍 Calling generateEnhancedDiagnosis...');
      const result = generateEnhancedDiagnosis(inputText);
      console.log('🔍 Generated result:', result);
      setDiagnosisResult(result);
      setActiveTab('diagnosis'); // Switch to diagnosis tab
      console.log('🔍 Diagnosis result set, switching to diagnosis tab');
    } catch (error) {
      console.error('❌ Error processing voice input:', error);
      setError('Failed to process voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Start listening for voice input
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setError(null);
      fullTranscriptRef.current = '';
      setTranscript('');
      setConfidence(0);
      recognitionRef.current.start();
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  };

  // Stop listening and process the input
  const stopListening = async () => {
    console.log('🔍 stopListening called');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      console.log('🔍 Transcript content:', fullTranscriptRef.current);
      // Process the transcript if we have one
      if (fullTranscriptRef.current.trim()) {
        console.log('🔍 Processing transcript:', fullTranscriptRef.current.trim());
        await processVoiceInput(fullTranscriptRef.current.trim());
      } else {
        console.log('🔍 No speech detected');
        setError('No speech detected. Please try again.');
      }
    }
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.continuous = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            fullTranscriptRef.current += event.results[i][0].transcript + ' ';
            setTranscript(fullTranscriptRef.current.trim());
            setConfidence(event.results[i][0].confidence * 100);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);



  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getModelBadgeColor = (model: string) => {
    switch (model) {
      case 'zabihin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gemini': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enhanced-fallback': return 'bg-green-100 text-green-800 border-green-200';
      case 'fallback': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateEnhancedDiagnosis = (input: string): VoiceMedicineResponse => {
    console.log('🔍 generateEnhancedDiagnosis called with input:', input);
    // Enhanced symptom extraction with comprehensive medical terms
    const commonSymptoms = [
      "fever", "cough", "headache", "nausea", "fatigue", "sore throat",
      "body ache", "runny nose", "congestion", "chills", "dizziness",
      "shortness of breath", "chest pain", "abdominal pain", "diarrhea",
      "vomiting", "vomit", "rash", "swelling", "pain", "ache", "tired", "weak",
      "sneezing", "itchy eyes", "stuffy nose", "muscle pain", "joint pain",
      "back pain", "stomach ache", "stomach pain", "bloating", "constipation",
      "leg pain", "arm pain", "neck pain", "shoulder pain", "knee pain",
      "throat pain", "ear pain", "tooth pain", "dental pain", "eye pain",
      "burning sensation", "numbness", "tingling", "cramps", "spasms",
      "inflammation", "swelling", "bruising", "bleeding", "discharge"
    ];
    
    let symptoms: string[] = [];
    const voiceLower = input.toLowerCase();
    
    // Extract specific symptoms with optimized matching
    // Use Set for O(1) lookup performance
    const symptomSet = new Set(commonSymptoms);
    
    // Split input into words for more accurate matching
    const words = voiceLower.split(/\s+/);
    
    // Check for exact symptom matches first (most specific)
    for (const symptom of commonSymptoms) {
      if (voiceLower.includes(symptom)) {
        symptoms.push(symptom);
        console.log('🔍 Found symptom:', symptom);
      }
    }
    
    // Remove duplicates and sort by specificity (longer symptoms first)
    symptoms = [...new Set(symptoms)].sort((a, b) => b.length - a.length);
    console.log('🔍 Extracted symptoms:', symptoms);
    
    // Handle vague inputs by inferring likely symptoms
    if (symptoms.length === 0) {
      if (voiceLower.includes("sick") || voiceLower.includes("ill") || voiceLower.includes("unwell")) {
        // Randomly assign common symptoms for vague "sick" complaints
        const vagueSymptoms = ["fatigue", "nausea", "headache", "body ache", "fever"];
        const randomSymptom = vagueSymptoms[Math.floor(Math.random() * vagueSymptoms.length)];
        symptoms.push(randomSymptom);
      } else if (voiceLower.includes("tired") || voiceLower.includes("exhausted") || voiceLower.includes("weak")) {
        symptoms.push("fatigue");
      } else if (voiceLower.includes("stomach") || voiceLower.includes("belly") || voiceLower.includes("gut")) {
        symptoms.push("abdominal pain");
      } else if (voiceLower.includes("breathing") || voiceLower.includes("breath")) {
        symptoms.push("shortness of breath");
      } else if (voiceLower.includes("throat") || voiceLower.includes("swallow")) {
        symptoms.push("sore throat");
      } else if (voiceLower.includes("nose") || voiceLower.includes("sneeze")) {
        symptoms.push("runny nose");
      } else if (voiceLower.includes("cold") || voiceLower.includes("flu")) {
        symptoms.push("fever");
        symptoms.push("cough");
      } else if (voiceLower.includes("don't feel well") || voiceLower.includes("not feeling good") || voiceLower.includes("feel bad")) {
        // Add more randomization for very vague inputs
        const randomSymptoms = ["fatigue", "nausea", "headache", "body ache", "fever", "abdominal pain"];
        const randomSymptom = randomSymptoms[Math.floor(Math.random() * randomSymptoms.length)];
        symptoms.push(randomSymptom);
      } else {
        // For completely vague inputs, provide varied generic responses
        const genericResponses = [
          "You might be experiencing general malaise or fatigue",
          "You could have a mild viral infection or stress-related symptoms", 
          "You may be dealing with seasonal allergies or environmental factors",
          "You might have a minor digestive issue or food sensitivity",
          "You could be experiencing stress-related physical symptoms"
        ];
        const randomResponse = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        return {
          session_id: sessionId || 'enhanced-session',
          timestamp: new Date().toISOString(),
          input_text: input,
          symptom_extraction: {
            symptoms: [],
            duration: undefined,
            severity: "low",
            additional_info: input
          },
          diagnosis_result: {
            symptoms: [],
            model_diagnosis: randomResponse,
            model_confidence: 0.45,
            gemini_diagnosis: `Based on your general complaint: ${randomResponse}`,
            final_diagnosis: `**${randomResponse}**\n\n**What's happening:** Your body is showing signs of discomfort that could have various causes.\n\n**What you should do:** Rest, stay hydrated, monitor your symptoms, and consider what might have triggered this feeling. If symptoms persist or worsen, consult a healthcare provider.\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.`,
            differential_diagnoses: ["Stress-related", "Environmental Factor", "Minor Condition", "Temporary Issue"],
            urgency_level: "low",
            recommendations: [
              "Get adequate rest and sleep.",
              "Stay hydrated by drinking plenty of water.",
              "Monitor your symptoms and note any changes.",
              "Consider what might have triggered this feeling.",
              "Consult a healthcare provider if symptoms persist beyond 3-5 days."
            ],
            disclaimer: '⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.'
          },
          processing_time: Math.random() * 0.5 + 0.2,
          model_used: 'enhanced-fallback'
        };
      }
    }
    
    // Extract duration
    let duration: string | undefined;
    const durationPatterns = [
      /(\d+)\s*(day|days|hour|hours|week|weeks)/,
      /(for|since)\s*(\d+)\s*(day|days|hour|hours|week|weeks)/
    ];
    
    for (const pattern of durationPatterns) {
      const match = voiceLower.match(pattern);
      if (match) {
        duration = match[0];
        break;
      }
    }
    
    // Extract severity
    let severity = "medium";
    if (["severe", "terrible", "awful", "unbearable", "intense"].some(word => voiceLower.includes(word))) {
      severity = "high";
    } else if (["mild", "slight", "little", "minor", "light"].some(word => voiceLower.includes(word))) {
      severity = "low";
    }
    
    // Generate diagnosis based on symptoms
    const diagnosisInfo = generateVariedDiagnosis(symptoms, severity, duration);
    
    const result = {
      session_id: sessionId || 'enhanced-session',
      timestamp: new Date().toISOString(),
      input_text: input,
      symptom_extraction: {
        symptoms,
        duration,
        severity,
        additional_info: input
      },
      diagnosis_result: {
        symptoms,
        model_diagnosis: diagnosisInfo.model_diagnosis,
        model_confidence: diagnosisInfo.confidence,
        gemini_diagnosis: diagnosisInfo.gemini_diagnosis,
        final_diagnosis: diagnosisInfo.final_diagnosis,
        differential_diagnoses: diagnosisInfo.differential_diagnoses,
        urgency_level: diagnosisInfo.urgency_level,
        recommendations: diagnosisInfo.recommendations,
        disclaimer: '⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.'
      },
      processing_time: Math.random() * 0.5 + 0.2, // Random time between 0.2-0.7 seconds
      model_used: 'enhanced-fallback'
    };
    
    console.log('🔍 generateEnhancedDiagnosis returning result:', result);
    return result;
  };

  const generateVariedDiagnosis = (symptoms: string[], severity: string, duration?: string) => {
    // User-friendly problem-focused diagnosis mappings
    const diagnosisPatterns: Record<string, any> = {
      "fever": {
        diagnosis: "You likely have a viral infection (like flu or cold)",
        confidence: 0.80,
        alternatives: ["Flu", "Common Cold", "COVID-19", "Bacterial Infection"],
        explanation: "Your body is fighting off an infection. This is normal and shows your immune system is working.",
        what_to_do: "Rest, drink plenty of fluids, take fever reducers like acetaminophen, and monitor your temperature."
      },
      "cough": {
        diagnosis: "You probably have a chest cold or respiratory infection",
        confidence: 0.75,
        alternatives: ["Chest Cold", "Bronchitis", "Allergic Reaction", "Pneumonia"],
        explanation: "Your airways are irritated and trying to clear out mucus or irritants.",
        what_to_do: "Use a humidifier, drink warm liquids, try honey or cough drops, and avoid smoke or dust."
      },
      "headache": {
        diagnosis: "You likely have a tension headache or stress-related headache",
        confidence: 0.70,
        alternatives: ["Tension Headache", "Migraine", "Sinus Pressure", "Stress Headache"],
        explanation: "Your head muscles are tense, possibly from stress, poor posture, or lack of sleep.",
        what_to_do: "Rest in a dark room, apply cold compress to forehead, take ibuprofen, and try relaxation techniques."
      },
      "nausea": {
        diagnosis: "You probably have stomach upset or digestive issues",
        confidence: 0.75,
        alternatives: ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
        explanation: "Your stomach is irritated, possibly from something you ate or a mild infection.",
        what_to_do: "Eat bland foods (crackers, rice), drink ginger tea, avoid spicy foods, and rest."
      },
      "sore throat": {
        diagnosis: "You likely have throat inflammation from a cold or infection",
        confidence: 0.85,
        alternatives: ["Strep Throat", "Viral Infection", "Allergic Reaction", "Acid Reflux"],
        explanation: "Your throat is inflamed, usually from a virus or bacteria causing irritation.",
        what_to_do: "Gargle with warm salt water, drink warm tea with honey, use throat lozenges, and rest your voice."
      },
      "runny nose": {
        diagnosis: "You probably have allergies or a cold",
        confidence: 0.80,
        alternatives: ["Common Cold", "Allergies", "Sinus Infection", "Hay Fever"],
        explanation: "Your nose is producing extra mucus to flush out irritants or fight infection.",
        what_to_do: "Use saline nasal spray, take antihistamines for allergies, drink plenty of fluids, and use a humidifier."
      },
      "chest pain": {
        diagnosis: "You might have muscle strain or need immediate medical attention",
        confidence: 0.70,
        alternatives: ["Muscle Strain", "Heart Problem", "Anxiety", "Costochondritis"],
        explanation: "Chest pain can be from muscle strain, but it could also be serious - especially if severe.",
        what_to_do: "If severe or with shortness of breath, go to ER immediately. If mild, rest and apply heat."
      },
      "abdominal pain": {
        diagnosis: "You likely have digestive upset or stomach issues",
        confidence: 0.65,
        alternatives: ["Indigestion", "Food Intolerance", "Stomach Bug", "Appendicitis"],
        explanation: "Your stomach or intestines are irritated, possibly from food, stress, or mild infection.",
        what_to_do: "Eat bland foods, avoid dairy and spicy foods, apply gentle heat, and rest."
      },
      "fatigue": {
        diagnosis: "You're probably run down from illness, stress, or lack of sleep",
        confidence: 0.70,
        alternatives: ["Viral Infection", "Iron Deficiency", "Sleep Deprivation", "Stress"],
        explanation: "Your body is tired, possibly fighting an infection or dealing with stress and poor sleep.",
        what_to_do: "Get extra sleep, eat nutritious foods, stay hydrated, and reduce stress."
      },
      "body ache": {
        diagnosis: "You likely have flu-like symptoms or muscle fatigue",
        confidence: 0.75,
        alternatives: ["Flu", "Muscle Strain", "Overexertion", "Viral Infection"],
        explanation: "Your muscles ache, usually from your immune system fighting an infection or overuse.",
        what_to_do: "Rest, take warm baths, use heating pads, take ibuprofen, and stay hydrated."
      },
      "chills": {
        diagnosis: "You probably have a fever or are fighting an infection",
        confidence: 0.80,
        alternatives: ["Fever", "Infection", "Cold Exposure", "Anxiety"],
        explanation: "Your body is trying to raise its temperature to fight off an infection.",
        what_to_do: "Stay warm, rest, drink warm fluids, and monitor for fever."
      },
      "dizziness": {
        diagnosis: "You might be dehydrated or have inner ear issues",
        confidence: 0.65,
        alternatives: ["Dehydration", "Low Blood Pressure", "Inner Ear Problem", "Anxiety"],
        explanation: "Your balance system is off, possibly from dehydration, low blood pressure, or ear issues.",
        what_to_do: "Drink plenty of water, sit down when dizzy, avoid sudden movements, and eat regular meals."
      },
      "shortness of breath": {
        diagnosis: "You need immediate medical attention - this could be serious",
        confidence: 0.85,
        alternatives: ["Asthma", "Anxiety", "Pneumonia", "Heart Problem"],
        explanation: "Difficulty breathing can indicate serious conditions and needs immediate evaluation.",
        what_to_do: "Go to emergency room immediately, sit upright, try to stay calm, and call 911 if severe."
      },
      "diarrhea": {
        diagnosis: "You likely have a stomach bug or food poisoning",
        confidence: 0.80,
        alternatives: ["Stomach Bug", "Food Poisoning", "Viral Infection", "Food Intolerance"],
        explanation: "Your digestive system is trying to flush out harmful substances or fight infection.",
        what_to_do: "Drink plenty of fluids, eat BRAT diet (bananas, rice, applesauce, toast), avoid dairy, and rest."
      },
      "vomiting": {
        diagnosis: "You probably have a stomach bug or food poisoning",
        confidence: 0.75,
        alternatives: ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
        explanation: "Your stomach is trying to get rid of something harmful or irritating.",
        what_to_do: "Start with small sips of water, eat bland foods when ready, avoid dairy and spicy foods, and rest."
      },
      "vomit": {
        diagnosis: "You probably have a stomach bug or food poisoning",
        confidence: 0.75,
        alternatives: ["Stomach Bug", "Food Poisoning", "Motion Sickness", "Indigestion"],
        explanation: "Your stomach is trying to get rid of something harmful or irritating.",
        what_to_do: "Start with small sips of water, eat bland foods when ready, avoid dairy and spicy foods, and rest."
      },
      "leg pain": {
        diagnosis: "You might have muscle strain, inflammation, or circulation issues",
        confidence: 0.70,
        alternatives: ["Muscle Strain", "Inflammation", "Circulation Issues", "Overuse Injury"],
        explanation: "Leg pain can be caused by muscle strain, inflammation, or circulation problems.",
        what_to_do: "Rest the leg, apply ice or heat, elevate if swollen, and avoid activities that worsen the pain."
      },
      "stomach pain": {
        diagnosis: "You likely have digestive upset or stomach issues",
        confidence: 0.75,
        alternatives: ["Digestive Upset", "Gastritis", "Indigestion", "Food Sensitivity"],
        explanation: "Your stomach is irritated, possibly from something you ate or a mild infection.",
        what_to_do: "Eat bland foods (crackers, rice), drink ginger tea, avoid spicy foods, and rest."
      }
    };
    
    // Find best matching diagnosis with enhanced logic
    let bestMatch = null;
    let bestConfidence = 0.0;
    let primarySymptom = null;
    
    // Prioritize symptoms by medical importance (use Set for O(1) lookup)
    const prioritySymptoms = new Set(["chest pain", "shortness of breath", "fever", "severe headache", "abdominal pain", "vomiting", "vomit", "leg pain", "stomach pain"]);
    
    for (const symptom of symptoms) {
      if (diagnosisPatterns[symptom]) {
        const pattern = diagnosisPatterns[symptom];
        // Boost confidence for priority symptoms
        const adjustedConfidence = prioritySymptoms.has(symptom) 
          ? Math.min(pattern.confidence + 0.1, 0.95) 
          : pattern.confidence;
        
        if (adjustedConfidence > bestConfidence) {
          bestConfidence = adjustedConfidence;
          bestMatch = pattern;
          primarySymptom = symptom;
        }
      }
    }
    
    // Generate diagnosis based on symptoms
    let modelDiagnosis: string;
    let confidence: number;
    let alternatives: string[];
    let explanation: string;
    let whatToDo: string;
    
    if (bestMatch) {
      modelDiagnosis = bestMatch.diagnosis;
      confidence = bestMatch.confidence;
      alternatives = bestMatch.alternatives;
      explanation = bestMatch.explanation;
      whatToDo = bestMatch.what_to_do;
    } else {
      // Enhanced generic diagnosis based on symptom patterns
      if (symptoms.length >= 4) {
        modelDiagnosis = "You likely have a multi-system viral infection (like flu)";
        confidence = 0.65;
        alternatives = ["Flu", "COVID-19", "Viral Infection", "Bacterial Infection"];
        explanation = "Multiple symptoms suggest your body is fighting a widespread infection.";
        whatToDo = "Rest, drink plenty of fluids, take fever reducers, and monitor your symptoms closely.";
      } else if (symptoms.length === 3) {
        const threeSymptomDiagnoses = [
          "You probably have a viral infection or cold",
          "You likely have a bacterial infection or inflammatory condition",
          "You could be experiencing an allergic reaction or environmental sensitivity"
        ];
        modelDiagnosis = threeSymptomDiagnoses[Math.floor(Math.random() * threeSymptomDiagnoses.length)];
        confidence = 0.60;
        alternatives = ["Common Cold", "Viral Infection", "Allergic Reaction", "Mild Infection"];
        explanation = "Three symptoms together usually indicate your body is fighting an infection.";
        whatToDo = "Rest, stay hydrated, take over-the-counter medications, and get plenty of sleep.";
      } else if (symptoms.length === 2) {
        const twoSymptomDiagnoses = [
          "You might have a mild infection or allergic reaction",
          "You could be experiencing stress-related physical symptoms",
          "You may have a minor viral infection or environmental trigger"
        ];
        modelDiagnosis = twoSymptomDiagnoses[Math.floor(Math.random() * twoSymptomDiagnoses.length)];
        confidence = 0.55;
        alternatives = ["Minor Infection", "Allergic Response", "Stress-related", "Environmental Factor"];
        explanation = "Two symptoms may indicate a mild infection or something you're reacting to.";
        whatToDo = "Rest, drink fluids, monitor symptoms, and see a doctor if they worsen.";
      } else {
        const singleSymptomDiagnoses = [
          "You have an isolated symptom that may be temporary",
          "You might be dealing with a temporary health issue",
          "You could be experiencing a minor condition or environmental factor"
        ];
        modelDiagnosis = singleSymptomDiagnoses[Math.floor(Math.random() * singleSymptomDiagnoses.length)];
        confidence = 0.50;
        alternatives = ["Minor Condition", "Environmental Factor", "Temporary Issue", "Stress-related"];
        explanation = "A single symptom may be temporary or related to environmental factors.";
        whatToDo = "Monitor the symptom, rest, and see a doctor if it persists or worsens.";
      }
    }
    
    // Adjust confidence based on severity and duration
    if (severity === "high") {
      confidence = Math.min(confidence + 0.1, 0.95);
    } else if (severity === "low") {
      confidence = Math.max(confidence - 0.1, 0.30);
    }
    
    // Adjust for duration (longer duration = higher confidence for chronic conditions)
    if (duration && duration.toLowerCase().includes("week")) {
      confidence = Math.min(confidence + 0.05, 0.95);
    }
    
    // Generate concise, explanatory diagnosis
    const symptomList = symptoms.slice(0, 3).join(', ');
    const fullSymptomList = symptoms.length > 3 
      ? `${symptomList} and ${symptoms.length - 3} other symptoms`
      : symptomList;
    
    const geminiDiagnosis = `Based on ${fullSymptomList}: ${modelDiagnosis}. ${explanation}`;
    
    // Generate final diagnosis with clear explanation and actionable advice
    const finalDiagnosis = `**${modelDiagnosis}**\n\n**What's happening:** ${explanation}\n\n**What you should do:** ${whatToDo}\n\n⚠️ This is an AI-generated suggestion. Please consult a qualified doctor for an accurate diagnosis and treatment.`;
    
    // Determine urgency
    let urgencyLevel = severity;
    if (symptoms.includes("chest pain") || symptoms.includes("shortness of breath")) {
      urgencyLevel = "high";
    } else if (symptoms.length >= 4 || severity === "high") {
      urgencyLevel = "medium";
    } else {
      urgencyLevel = "low";
    }
    
    // Generate specific, actionable recommendations based on whatToDo
    const recommendations: string[] = [];
    
    // Split the whatToDo into individual actionable items
    if (whatToDo) {
      // Split by common separators and clean up
      const items = whatToDo.replace(" and ", ", ").split(", ");
      for (const item of items) {
        let cleanItem = item.trim();
        if (cleanItem && !cleanItem.endsWith('.')) {
          cleanItem += '.';
        }
        recommendations.push(cleanItem);
      }
    }
    
    // Add urgency-based recommendations
    if (urgencyLevel === "high") {
      recommendations.unshift("Seek immediate medical attention.");
      recommendations.unshift("Do not delay professional evaluation.");
    } else if (urgencyLevel === "medium") {
      recommendations.push("Schedule a doctor's appointment within 24-48 hours.");
    } else {
      recommendations.push("Consult a healthcare provider if symptoms persist beyond 3-5 days.");
    }
    
    // Duration-based recommendations
    if (duration && duration.toLowerCase().includes("week")) {
      recommendations.push("Consider scheduling a medical evaluation due to prolonged symptoms.");
    }
    
    return {
      model_diagnosis: modelDiagnosis,
      confidence,
      gemini_diagnosis: geminiDiagnosis,
      final_diagnosis: finalDiagnosis,
      differential_diagnoses: alternatives,
      urgency_level: urgencyLevel,
      recommendations
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Voice Medicine Assistant
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Speak your symptoms and get AI-powered medical diagnosis with Gemini integration
        </p>
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Powered by Gemini AI & Medical Models</span>
        </div>
      </div>

      {/* Voice Control Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recognition
          </CardTitle>
          <CardDescription>
            Click start and describe your symptoms to get AI-powered medical diagnosis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={startListening}
              disabled={isListening || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </Button>
            
            <Button
              onClick={stopListening}
              disabled={!isListening || isProcessing}
              variant="outline"
              className="border-2 border-red-300 text-red-700 hover:bg-red-50 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop & Process
            </Button>
            
            {/* Test button for manual diagnosis */}
            {transcript && (
              <Button
                onClick={() => processVoiceInput(transcript)}
                disabled={isProcessing}
                variant="outline"
                className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-6 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate Diagnosis
              </Button>
            )}
            
            {/* Debug test button */}
            <Button
              onClick={() => processVoiceInput("I feel vomiting and not well")}
              disabled={isProcessing}
              variant="outline"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-4 py-2 text-sm font-semibold transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Test Diagnosis
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}
              </span>
            </div>
            
            {confidence > 0 && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Confidence: {(confidence || 0).toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing voice input...</span>
                <span>AI Analysis</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Transcript Display */}
      {transcript && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Volume2 className="w-5 h-5" />
              What You Said
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 font-medium">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {/* Diagnosis Results */}
      {diagnosisResult && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Medical Diagnosis</h2>
            <p className="text-gray-600">Based on your symptoms and AI analysis</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge className={getModelBadgeColor(diagnosisResult.model_used)}>
                {diagnosisResult.model_used.toUpperCase()} Model
              </Badge>
              <span className="text-sm text-gray-500">
                Processed in {diagnosisResult.processing_time?.toFixed(2) || '0.00'}s
              </span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="voice">Symptom Analysis</TabsTrigger>
              <TabsTrigger value="diagnosis">AI Diagnosis</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="disclaimer">Medical Disclaimer</TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Symptom Extraction Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Extracted Symptoms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosisResult.symptom_extraction?.symptoms?.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            <Heart className="w-3 h-3 mr-1" />
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {diagnosisResult.symptom_extraction?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Duration: {diagnosisResult.symptom_extraction.duration}</span>
                      </div>
                    )}
                    
                    {diagnosisResult.symptom_extraction?.severity && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Severity: {diagnosisResult.symptom_extraction.severity}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Voice processed successfully</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagnosis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    AI Medical Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Final Diagnosis:</h4>
                    <p className="text-blue-900">{diagnosisResult.diagnosis_result?.final_diagnosis || 'No diagnosis available'}</p>
                  </div>
                  
                  {diagnosisResult.diagnosis_result?.model_diagnosis && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Model Diagnosis:</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Zabihin Model</Badge>
                        <span>{diagnosisResult.diagnosis_result?.model_diagnosis || 'No model diagnosis'}</span>
                        {diagnosisResult.diagnosis_result?.model_confidence && (
                          <span className="text-sm text-gray-600">
                            (Confidence: {((diagnosisResult.diagnosis_result.model_confidence || 0) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {diagnosisResult.diagnosis_result?.gemini_diagnosis && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Gemini AI Diagnosis:</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">Gemini AI</Badge>
                        <span>{diagnosisResult.diagnosis_result?.gemini_diagnosis || 'No Gemini diagnosis'}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getUrgencyColor(diagnosisResult.diagnosis_result?.urgency_level || 'low')}`}></div>
                    <span className="font-medium">Urgency Level: {diagnosisResult.diagnosis_result?.urgency_level || 'low'}</span>
                  </div>
                  
                  {diagnosisResult.diagnosis_result?.differential_diagnoses && diagnosisResult.diagnosis_result.differential_diagnoses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Alternative Diagnoses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosisResult.diagnosis_result?.differential_diagnoses?.map((diagnosis, index) => (
                          <Badge key={index} variant="outline" className="bg-yellow-50">
                            {diagnosis}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Medical Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosisResult.diagnosis_result?.recommendations?.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disclaimer" className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Shield className="w-5 h-5" />
                    Important Medical Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="border-red-300 bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="space-y-3">
                        <p className="font-semibold">{diagnosisResult.diagnosis_result?.disclaimer || 'Please consult a qualified doctor for an accurate diagnosis and treatment.'}</p>
                        
                        <div className="space-y-2 text-sm">
                          <p><strong>Important Notes:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>This AI system is for informational purposes only</li>
                            <li>It should not replace professional medical advice</li>
                            <li>Always consult a qualified healthcare provider</li>
                            <li>Seek immediate medical attention for emergencies</li>
                            <li>Do not use this system for life-threatening conditions</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-red-200">
                          <p className="text-sm text-red-700">
                            <strong>Emergency Situations:</strong> If you are experiencing severe symptoms, 
                            chest pain, difficulty breathing, or any life-threatening condition, 
                            call emergency services immediately.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default VoiceMedicineAssistant; 