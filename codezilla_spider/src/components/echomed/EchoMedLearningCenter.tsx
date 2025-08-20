import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Brain, 
  Heart, 
  Activity,
  Clock,
  CheckCircle,
  Play,
  Pause,
  Rewind,
  Forward,
  Volume2,
  VolumeX,
  Settings,
  Star,
  Users,
  TrendingUp,
  Award,
  Target,
  Zap,
  Sparkles,
  Eye,
  Shield,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed: boolean;
  progress: number;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const EchoMedLearningCenter = () => {
  const [activeTab, setActiveTab] = useState("tutorials");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(300); // 5 minutes in seconds

  // Sample tutorials
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Understanding Your Vital Signs',
      description: 'Learn about blood pressure, heart rate, temperature, and respiratory rate.',
      duration: '5 min',
      difficulty: 'Beginner',
      category: 'Basics',
      completed: false,
      progress: 0
    },
    {
      id: '2',
      title: 'First Aid Essentials',
      description: 'Basic first aid procedures for common injuries and emergencies.',
      duration: '8 min',
      difficulty: 'Beginner',
      category: 'Emergency',
      completed: false,
      progress: 0
    },
    {
      id: '3',
      title: 'Nutrition Fundamentals',
      description: 'Understanding macronutrients, micronutrients, and healthy eating patterns.',
      duration: '10 min',
      difficulty: 'Intermediate',
      category: 'Nutrition',
      completed: false,
      progress: 0
    },
    {
      id: '4',
      title: 'Mental Health Awareness',
      description: 'Recognizing signs of stress, anxiety, and depression.',
      duration: '12 min',
      difficulty: 'Intermediate',
      category: 'Mental Health',
      completed: false,
      progress: 0
    },
    {
      id: '5',
      title: 'Exercise Physiology',
      description: 'How exercise affects your body and cardiovascular system.',
      duration: '15 min',
      difficulty: 'Advanced',
      category: 'Fitness',
      completed: false,
      progress: 0
    }
  ];

  // Sample FAQs
  const faqs: FAQ[] = [
    {
      question: "How accurate is AI health advice?",
      answer: "AI health advice is designed to provide general information and guidance. However, it should not replace professional medical consultation. Always consult with healthcare professionals for personalized medical advice.",
      category: "AI & Technology"
    },
    {
      question: "What should I do in a medical emergency?",
      answer: "In a medical emergency, call emergency services immediately (911 in the US). Do not rely on AI or online resources for emergency situations.",
      category: "Emergency"
    },
    {
      question: "How often should I check my vital signs?",
      answer: "The frequency depends on your health status and doctor's recommendations. Generally, healthy adults should have regular check-ups annually.",
      category: "Health Monitoring"
    },
    {
      question: "Can AI diagnose medical conditions?",
      answer: "No, AI cannot diagnose medical conditions. It can only provide general information and suggestions. Always consult healthcare professionals for diagnosis.",
      category: "AI & Technology"
    },
    {
      question: "What's the best way to maintain good mental health?",
      answer: "Maintain regular sleep, exercise, healthy diet, social connections, and stress management techniques. Seek professional help if needed.",
      category: "Mental Health"
    }
  ];

  const categories = ['All', 'Basics', 'Emergency', 'Nutrition', 'Mental Health', 'Fitness'];

  const handleTutorialSelect = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Center
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Expand your health knowledge</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tutorials Available</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Total</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">4.8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="ai-explanation" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tutorial List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {tutorials.map((tutorial) => (
                  <Card 
                    key={tutorial.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTutorial?.id === tutorial.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTutorialSelect(tutorial)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{tutorial.title}</h3>
                            <Badge className={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {tutorial.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {tutorial.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tutorial.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Play className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                      {tutorial.progress > 0 && (
                        <div className="mt-4">
                          <Progress value={tutorial.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{tutorial.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tutorial Player */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Tutorial Player
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTutorial ? (
                    <>
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Video Player</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">{selectedTutorial.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {selectedTutorial.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(totalTime)}</span>
                          </div>
                          <Progress value={(currentTime / totalTime) * 100} className="h-2" />
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm">
                            <Rewind className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 rounded-full"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Forward className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <Button variant="outline" size="sm">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select a tutorial to start learning</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-explanation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Understanding AI in Healthcare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    What AI Can Do
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Provide general health information and education
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Help identify potential symptoms and conditions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Offer lifestyle and wellness recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Assist with health monitoring and tracking
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    What AI Cannot Do
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Diagnose medical conditions
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Replace professional medical advice
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Handle emergency situations
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Prescribe medications or treatments
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Important Disclaimer
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  EchoMed AI is designed to provide educational information and general health guidance. 
                  It is not a substitute for professional medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare professionals for medical concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { EchoMedLearningCenter }; 