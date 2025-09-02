import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils, Clock, Zap, Leaf, Fish, Apple, Coffee, Sun, Moon, Cookie, Plus, Heart, AlertTriangle } from 'lucide-react';

interface MealOption {
  name: string;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  glycemic_index: number;
  calories: number;
  serving_size: string;
  description: string;
  icon: React.ReactNode;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const mealOptions: MealOption[] = [
  // BREAKFAST OPTIONS
  {
    name: "Oatmeal with Berries",
    carbohydrates: 45,
    protein: 8,
    fat: 4,
    fiber: 8,
    glycemic_index: 55,
    calories: 250,
    serving_size: "1 bowl",
    description: "Steel-cut oats with fresh berries and a drizzle of honey",
    icon: <Apple className="h-5 w-5" />,
    category: 'breakfast'
  },
  {
    name: "Greek Yogurt Parfait",
    carbohydrates: 35,
    protein: 20,
    fat: 6,
    fiber: 4,
    glycemic_index: 40,
    calories: 280,
    serving_size: "1 large bowl",
    description: "Greek yogurt with granola, nuts, and fresh fruit",
    icon: <Leaf className="h-5 w-5" />,
    category: 'breakfast'
  },
  {
    name: "Avocado Toast",
    carbohydrates: 30,
    protein: 12,
    fat: 18,
    fiber: 10,
    glycemic_index: 45,
    calories: 320,
    serving_size: "2 slices",
    description: "Whole grain toast with mashed avocado and poached egg",
    icon: <Leaf className="h-5 w-5" />,
    category: 'breakfast'
  },
  {
    name: "Pancakes with Syrup",
    carbohydrates: 65,
    protein: 8,
    fat: 12,
    fiber: 2,
    glycemic_index: 75,
    calories: 420,
    serving_size: "3 medium pancakes",
    description: "Fluffy pancakes with maple syrup and butter",
    icon: <Utensils className="h-5 w-5" />,
    category: 'breakfast'
  },
  {
    name: "Breakfast Burrito",
    carbohydrates: 55,
    protein: 25,
    fat: 15,
    fiber: 6,
    glycemic_index: 60,
    calories: 450,
    serving_size: "1 large burrito",
    description: "Scrambled eggs, cheese, and vegetables in a tortilla",
    icon: <Utensils className="h-5 w-5" />,
    category: 'breakfast'
  },

  // LUNCH OPTIONS
  {
    name: "Grilled Chicken Salad",
    carbohydrates: 20,
    protein: 35,
    fat: 12,
    fiber: 8,
    glycemic_index: 25,
    calories: 320,
    serving_size: "1 large salad",
    description: "Mixed greens with grilled chicken, vegetables, and olive oil dressing",
    icon: <Leaf className="h-5 w-5" />,
    category: 'lunch'
  },
  {
    name: "Turkey Sandwich",
    carbohydrates: 45,
    protein: 28,
    fat: 8,
    fiber: 6,
    glycemic_index: 55,
    calories: 380,
    serving_size: "1 sandwich",
    description: "Whole wheat bread with turkey, lettuce, tomato, and mayo",
    icon: <Utensils className="h-5 w-5" />,
    category: 'lunch'
  },
  {
    name: "Quinoa Buddha Bowl",
    carbohydrates: 55,
    protein: 18,
    fat: 14,
    fiber: 12,
    glycemic_index: 50,
    calories: 420,
    serving_size: "1 large bowl",
    description: "Quinoa with roasted vegetables, chickpeas, and tahini dressing",
    icon: <Leaf className="h-5 w-5" />,
    category: 'lunch'
  },
  {
    name: "Pasta Primavera",
    carbohydrates: 75,
    protein: 15,
    fat: 8,
    fiber: 6,
    glycemic_index: 65,
    calories: 450,
    serving_size: "1 plate",
    description: "Whole wheat pasta with mixed vegetables and olive oil",
    icon: <Utensils className="h-5 w-5" />,
    category: 'lunch'
  },
  {
    name: "Fish Tacos",
    carbohydrates: 40,
    protein: 30,
    fat: 16,
    fiber: 8,
    glycemic_index: 45,
    calories: 420,
    serving_size: "2 tacos",
    description: "Grilled fish with cabbage slaw in corn tortillas",
    icon: <Fish className="h-5 w-5" />,
    category: 'lunch'
  },

  // DINNER OPTIONS
  {
    name: "Grilled Salmon with Rice",
    carbohydrates: 50,
    protein: 35,
    fat: 18,
    fiber: 2,
    glycemic_index: 60,
    calories: 520,
    serving_size: "1 plate",
    description: "Grilled salmon fillet with brown rice and steamed broccoli",
    icon: <Fish className="h-5 w-5" />,
    category: 'dinner'
  },
  {
    name: "Chicken Stir Fry",
    carbohydrates: 35,
    protein: 40,
    fat: 12,
    fiber: 8,
    glycemic_index: 45,
    calories: 420,
    serving_size: "1 large plate",
    description: "Stir-fried chicken with mixed vegetables and brown rice",
    icon: <Utensils className="h-5 w-5" />,
    category: 'dinner'
  },
  {
    name: "Beef and Vegetable Stew",
    carbohydrates: 30,
    protein: 45,
    fat: 15,
    fiber: 10,
    glycemic_index: 40,
    calories: 480,
    serving_size: "1 large bowl",
    description: "Slow-cooked beef with root vegetables and herbs",
    icon: <Utensils className="h-5 w-5" />,
    category: 'dinner'
  },
  {
    name: "Vegetarian Curry",
    carbohydrates: 60,
    protein: 20,
    fat: 16,
    fiber: 12,
    glycemic_index: 55,
    calories: 450,
    serving_size: "1 large bowl",
    description: "Mixed vegetables in coconut curry sauce with basmati rice",
    icon: <Leaf className="h-5 w-5" />,
    category: 'dinner'
  },
  {
    name: "Pizza Margherita",
    carbohydrates: 80,
    protein: 25,
    fat: 20,
    fiber: 4,
    glycemic_index: 70,
    calories: 580,
    serving_size: "2 large slices",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    icon: <Utensils className="h-5 w-5" />,
    category: 'dinner'
  },

  // SNACK OPTIONS
  {
    name: "Apple with Peanut Butter",
    carbohydrates: 25,
    protein: 6,
    fat: 8,
    fiber: 5,
    glycemic_index: 35,
    calories: 200,
    serving_size: "1 medium apple",
    description: "Fresh apple slices with natural peanut butter",
    icon: <Apple className="h-5 w-5" />,
    category: 'snack'
  },
  {
    name: "Greek Yogurt with Nuts",
    carbohydrates: 15,
    protein: 15,
    fat: 12,
    fiber: 2,
    glycemic_index: 30,
    calories: 220,
    serving_size: "1 cup",
    description: "Greek yogurt topped with mixed nuts and honey",
    icon: <Leaf className="h-5 w-5" />,
    category: 'snack'
  },
  {
    name: "Hummus with Veggies",
    carbohydrates: 20,
    protein: 8,
    fat: 10,
    fiber: 6,
    glycemic_index: 25,
    calories: 180,
    serving_size: "1/2 cup hummus",
    description: "Fresh vegetables with homemade hummus dip",
    icon: <Leaf className="h-5 w-5" />,
    category: 'snack'
  },
  {
    name: "Trail Mix",
    carbohydrates: 30,
    protein: 8,
    fat: 15,
    fiber: 4,
    glycemic_index: 40,
    calories: 280,
    serving_size: "1/4 cup",
    description: "Mixed nuts, dried fruits, and dark chocolate chips",
    icon: <Cookie className="h-5 w-5" />,
    category: 'snack'
  },
  {
    name: "Cheese and Crackers",
    carbohydrates: 20,
    protein: 10,
    fat: 12,
    fiber: 1,
    glycemic_index: 35,
    calories: 240,
    serving_size: "6 crackers",
    description: "Whole grain crackers with aged cheddar cheese",
    icon: <Utensils className="h-5 w-5" />,
    category: 'snack'
  },
  {
    name: "Protein Smoothie",
    carbohydrates: 25,
    protein: 20,
    fat: 5,
    fiber: 3,
    glycemic_index: 30,
    calories: 220,
    serving_size: "1 large glass",
    description: "Banana, protein powder, and almond milk smoothie",
    icon: <Coffee className="h-5 w-5" />,
    category: 'snack'
  }
];

interface MealSuggestionsProps {
  onSelectMeal: (meal: MealOption) => void;
  selectedCategory?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export function MealSuggestions({ onSelectMeal, selectedCategory = 'breakfast' }: MealSuggestionsProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [activeTab, setActiveTab] = useState(selectedCategory);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customMeal, setCustomMeal] = useState({
    name: '',
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    glycemic_index: 50,
    calories: 0
  });

  const handleSelectMeal = (meal: MealOption) => {
    setSelectedMeal(meal);
    onSelectMeal(meal);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakfast': return <Sun className="h-4 w-4" />;
      case 'lunch': return <Zap className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      case 'snack': return <Cookie className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getGlycemicIndexColor = (gi: number) => {
    if (gi <= 55) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100';
    if (gi <= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100';
  };

  const getGlycemicIndexLabel = (gi: number) => {
    if (gi <= 55) return 'Low GI';
    if (gi <= 70) return 'Medium GI';
    return 'High GI';
  };

  const getHealthRecommendation = (meal: MealOption) => {
    const { carbohydrates, protein, fat, fiber, glycemic_index, calories } = meal;
    
    // Health scoring algorithm
    let score = 0;
    
    // GI score (lower is better)
    if (glycemic_index <= 55) score += 3;
    else if (glycemic_index <= 70) score += 2;
    else score += 1;
    
    // Protein score (higher is better, but not excessive)
    if (protein >= 15 && protein <= 30) score += 2;
    else if (protein >= 10) score += 1;
    
    // Fiber score (higher is better)
    if (fiber >= 8) score += 2;
    else if (fiber >= 4) score += 1;
    
    // Fat score (moderate is better)
    if (fat >= 8 && fat <= 15) score += 2;
    else if (fat >= 5 && fat <= 20) score += 1;
    
    // Calorie score (reasonable range)
    if (calories >= 200 && calories <= 500) score += 1;
    
    if (score >= 7) return { status: 'Excellent', color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100', icon: Heart };
    if (score >= 5) return { status: 'Good', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100', icon: Heart };
    if (score >= 3) return { status: 'Fair', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100', icon: AlertTriangle };
    return { status: 'Poor', color: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100', icon: AlertTriangle };
  };

  const handleCustomMealSubmit = () => {
    if (customMeal.name && customMeal.carbohydrates > 0) {
      const customMealOption: MealOption = {
        ...customMeal,
        serving_size: '1 serving',
        description: 'Custom meal',
        icon: <Plus className="h-5 w-5" />,
        category: activeTab as any
      };
      handleSelectMeal(customMealOption);
      setShowCustomForm(false);
      setCustomMeal({
        name: '',
        carbohydrates: 0,
        protein: 0,
        fat: 0,
        fiber: 0,
        glycemic_index: 50,
        calories: 0
      });
    }
  };

  const renderMealGrid = (category: string) => {
    const filteredMeals = mealOptions.filter(meal => meal.category === category);
    
    return (
      <div className="grid grid-cols-1 gap-2 max-h-64 sm:max-h-80 overflow-y-auto">
        {filteredMeals.map((meal, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMeal?.name === meal.name 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleSelectMeal(meal)}
          >
            <CardContent className="p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {meal.icon}
                  <CardTitle className="text-xs sm:text-sm">{meal.name}</CardTitle>
                </div>
                {(() => {
                  const health = getHealthRecommendation(meal);
                  const IconComponent = health.icon;
                  return (
                    <Badge className={`text-xs ${health.color} flex items-center gap-1 self-start sm:self-auto`}>
                      <IconComponent className="w-3 h-3" />
                      {health.status}
                    </Badge>
                  );
                })()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {meal.carbohydrates}g carbs • {meal.calories} cal
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="breakfast" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1">
            <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Breakfast</span>
          </TabsTrigger>
          <TabsTrigger value="lunch" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Lunch</span>
          </TabsTrigger>
          <TabsTrigger value="dinner" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1">
            <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Dinner</span>
          </TabsTrigger>
          <TabsTrigger value="snack" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1">
            <Cookie className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Snack</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakfast" className="mt-4">
          {renderMealGrid('breakfast')}
        </TabsContent>

        <TabsContent value="lunch" className="mt-4">
          {renderMealGrid('lunch')}
        </TabsContent>

        <TabsContent value="dinner" className="mt-4">
          {renderMealGrid('dinner')}
        </TabsContent>

        <TabsContent value="snack" className="mt-4">
          {renderMealGrid('snack')}
        </TabsContent>
      </Tabs>

      {/* Custom Food Option */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setShowCustomForm(!showCustomForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Food
        </Button>
        
        {showCustomForm && (
          <Card className="mt-3">
            <CardContent className="p-3 sm:p-4 space-y-3">
              <div>
                <Label htmlFor="custom_name">Food Name</Label>
                <Input
                  id="custom_name"
                  value={customMeal.name}
                  onChange={(e) => setCustomMeal({...customMeal, name: e.target.value})}
                  placeholder="e.g., Homemade Pizza"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="custom_carbs">Carbs (g)</Label>
                  <Input
                    id="custom_carbs"
                    type="number"
                    value={customMeal.carbohydrates}
                    onChange={(e) => setCustomMeal({...customMeal, carbohydrates: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_protein">Protein (g)</Label>
                  <Input
                    id="custom_protein"
                    type="number"
                    value={customMeal.protein}
                    onChange={(e) => setCustomMeal({...customMeal, protein: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_fat">Fat (g)</Label>
                  <Input
                    id="custom_fat"
                    type="number"
                    value={customMeal.fat}
                    onChange={(e) => setCustomMeal({...customMeal, fat: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="custom_fiber">Fiber (g)</Label>
                  <Input
                    id="custom_fiber"
                    type="number"
                    value={customMeal.fiber}
                    onChange={(e) => setCustomMeal({...customMeal, fiber: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_gi">Glycemic Index</Label>
                  <Input
                    id="custom_gi"
                    type="number"
                    value={customMeal.glycemic_index}
                    onChange={(e) => setCustomMeal({...customMeal, glycemic_index: Number(e.target.value)})}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="custom_calories">Calories</Label>
                  <Input
                    id="custom_calories"
                    type="number"
                    value={customMeal.calories}
                    onChange={(e) => setCustomMeal({...customMeal, calories: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCustomMealSubmit} className="flex-1">
                  Add to Form
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCustomForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedMeal && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <div className="text-blue-600">{selectedMeal.icon}</div>
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedMeal.name} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
