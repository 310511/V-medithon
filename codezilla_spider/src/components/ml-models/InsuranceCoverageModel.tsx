import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Shield, 
  Clock, 
  TrendingUp, 
  FileText, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  BarChart3,
  Target,
  DollarSign,
  MapPin,
  Building
} from "lucide-react";

interface InsuranceResult {
  coveragePrediction: string;
  probability: number;
  factors: string[];
  recommendations: string[];
  confidence: number;
  marketTrends: Array<{
    trend: string;
    impact: string;
    confidence: number;
  }>;
}

interface InsuranceInput {
  state: string;
  age: number;
  income: number;
  employmentStatus: string;
  familySize: number;
  preExistingConditions: boolean;
  currentInsurance: string;
  marketplaceEnrollment: boolean;
  medicaidEligible: boolean;
  medicareEligible: boolean;
}

export const InsuranceCoverageModel: React.FC = () => {
  const [insuranceInput, setInsuranceInput] = useState<InsuranceInput>({
    state: "California",
    age: 35,
    income: 50000,
    employmentStatus: "Employed",
    familySize: 2,
    preExistingConditions: false,
    currentInsurance: "Employer",
    marketplaceEnrollment: false,
    medicaidEligible: false,
    medicareEligible: false
  });

  const [insuranceResult, setInsuranceResult] = useState<InsuranceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  const employmentStatuses = [
    "Employed", "Unemployed", "Self-Employed", "Retired", "Student", "Part-Time"
  ];

  const insuranceTypes = [
    "Employer", "Marketplace", "Medicaid", "Medicare", "Private", "None"
  ];

  const analyzeInsuranceCoverage = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate ML analysis process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAnalysisProgress(i);
    }

    // ML Algorithm: Insurance coverage prediction
    let coverageScore = 0;
    const factors = [];
    const recommendations = [];
    const marketTrends = [];

    // State-specific factors
    const stateFactors = {
      "California": { expansion: true, uninsuredRate: 7.2, marketplaceEnrollment: 1.5 },
      "Texas": { expansion: false, uninsuredRate: 18.4, marketplaceEnrollment: 1.1 },
      "Florida": { expansion: false, uninsuredRate: 13.6, marketplaceEnrollment: 1.8 },
      "New York": { expansion: true, uninsuredRate: 5.2, marketplaceEnrollment: 0.8 },
      "Pennsylvania": { expansion: true, uninsuredRate: 5.6, marketplaceEnrollment: 0.9 }
    };

    const stateData = stateFactors[insuranceInput.state as keyof typeof stateFactors] || 
                     { expansion: false, uninsuredRate: 10.0, marketplaceEnrollment: 1.2 };

    // Income-based analysis
    if (insuranceInput.income < 20000) {
      coverageScore += 30;
      factors.push("Low income - likely eligible for Medicaid or subsidies");
      if (!stateData.expansion) {
        factors.push("State has not expanded Medicaid - coverage gap possible");
      }
    } else if (insuranceInput.income < 40000) {
      coverageScore += 20;
      factors.push("Moderate income - likely eligible for marketplace subsidies");
    } else if (insuranceInput.income < 60000) {
      coverageScore += 10;
      factors.push("Middle income - may qualify for partial subsidies");
    } else {
      coverageScore += 5;
      factors.push("Higher income - limited subsidy eligibility");
    }

    // Employment status
    if (insuranceInput.employmentStatus === "Employed") {
      coverageScore += 15;
      factors.push("Employed - likely has employer-sponsored insurance");
    } else if (insuranceInput.employmentStatus === "Unemployed") {
      coverageScore += 25;
      factors.push("Unemployed - may qualify for Medicaid or marketplace");
    } else if (insuranceInput.employmentStatus === "Self-Employed") {
      coverageScore += 20;
      factors.push("Self-employed - marketplace options available");
    }

    // Age factors
    if (insuranceInput.age >= 65) {
      coverageScore += 20;
      factors.push("Medicare eligible");
      recommendations.push("Enroll in Medicare Parts A and B");
      recommendations.push("Consider Medicare Advantage or Medigap plans");
    } else if (insuranceInput.age < 26) {
      coverageScore += 15;
      factors.push("Young adult - may be eligible for parent's plan");
      recommendations.push("Check eligibility for parent's health insurance plan");
    }

    // Family size
    if (insuranceInput.familySize > 4) {
      coverageScore += 10;
      factors.push("Large family - higher subsidy eligibility");
    }

    // Pre-existing conditions
    if (insuranceInput.preExistingConditions) {
      factors.push("Pre-existing conditions - guaranteed issue under ACA");
      recommendations.push("All marketplace plans must cover pre-existing conditions");
    }

    // Current insurance status
    if (insuranceInput.currentInsurance === "None") {
      coverageScore += 30;
      factors.push("Currently uninsured - high priority for coverage");
      recommendations.push("Explore marketplace options during open enrollment");
      recommendations.push("Check Medicaid eligibility");
    }

    // Medicaid eligibility
    if (insuranceInput.medicaidEligible) {
      coverageScore += 25;
      factors.push("Medicaid eligible");
      recommendations.push("Apply for Medicaid coverage");
    }

    // Marketplace enrollment
    if (!insuranceInput.marketplaceEnrollment && insuranceInput.currentInsurance === "None") {
      recommendations.push("Enroll in marketplace during open enrollment period");
      recommendations.push("Check for special enrollment period eligibility");
    }

    // Market trends analysis
    marketTrends.push({
      trend: "Marketplace enrollment increasing",
      impact: "More options and competition",
      confidence: 85
    });

    if (stateData.expansion) {
      marketTrends.push({
        trend: "Medicaid expansion in place",
        impact: "Better coverage for low-income individuals",
        confidence: 90
      });
    } else {
      marketTrends.push({
        trend: "No Medicaid expansion",
        impact: "Coverage gap for low-income individuals",
        confidence: 95
      });
    }

    marketTrends.push({
      trend: "ACA protections maintained",
      impact: "Pre-existing conditions covered",
      confidence: 80
    });

    // Calculate coverage prediction
    let coveragePrediction = "Likely Uninsured";
    if (coverageScore > 60) coveragePrediction = "Likely Insured";
    else if (coverageScore > 30) coveragePrediction = "May Need Assistance";

    // Generate additional recommendations
    if (coveragePrediction === "Likely Uninsured") {
      recommendations.push("Contact local health insurance navigator");
      recommendations.push("Explore community health centers");
      recommendations.push("Check for state-specific programs");
    } else if (coveragePrediction === "May Need Assistance") {
      recommendations.push("Compare marketplace plans");
      recommendations.push("Calculate subsidy eligibility");
      recommendations.push("Consider short-term health plans if needed");
    }

    setInsuranceResult({
      coveragePrediction,
      probability: Math.min(coverageScore, 95),
      factors,
      recommendations,
      confidence: Math.min(85 + (coverageScore / 10), 95),
      marketTrends
    });

    setIsAnalyzing(false);
  };

  const getCoverageColor = (prediction: string) => {
    switch (prediction) {
      case "Likely Insured": return "bg-green-100 text-green-800";
      case "May Need Assistance": return "bg-yellow-100 text-yellow-800";
      case "Likely Uninsured": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes("Better") || impact.includes("increasing")) return "text-green-600";
    if (impact.includes("gap") || impact.includes("decreasing")) return "text-red-600";
    return "text-blue-600";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Insurance Coverage AI</h1>
              <p className="text-muted-foreground">ML-powered healthcare insurance coverage prediction and analysis</p>
            </div>
          </div>
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Insurance Coverage Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demographics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={insuranceInput.age}
                    onChange={(e) => setInsuranceInput({...insuranceInput, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="familySize">Family Size</Label>
                  <Input
                    id="familySize"
                    type="number"
                    value={insuranceInput.familySize}
                    onChange={(e) => setInsuranceInput({...insuranceInput, familySize: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Location and Income */}
              <div className="space-y-3">
                <h3 className="font-semibold">Location & Financial Information</h3>
                <div>
                  <Label>State</Label>
                  <Select value={insuranceInput.state} onValueChange={(value) => setInsuranceInput({...insuranceInput, state: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Annual Income ($) - {insuranceInput.income.toLocaleString()}</Label>
                  <Slider
                    value={[insuranceInput.income]}
                    onValueChange={(value) => setInsuranceInput({...insuranceInput, income: value[0]})}
                    max={200000}
                    min={0}
                    step={1000}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Employment and Insurance Status */}
              <div className="space-y-3">
                <h3 className="font-semibold">Employment & Current Insurance</h3>
                <div>
                  <Label>Employment Status</Label>
                  <Select value={insuranceInput.employmentStatus} onValueChange={(value) => setInsuranceInput({...insuranceInput, employmentStatus: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Current Insurance</Label>
                  <Select value={insuranceInput.currentInsurance} onValueChange={(value) => setInsuranceInput({...insuranceInput, currentInsurance: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Eligibility Factors */}
              <div className="space-y-3">
                <h3 className="font-semibold">Eligibility Factors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preExistingConditions"
                      checked={insuranceInput.preExistingConditions}
                      onChange={(e) => setInsuranceInput({...insuranceInput, preExistingConditions: e.target.checked})}
                    />
                    <Label htmlFor="preExistingConditions">Pre-existing Conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="marketplaceEnrollment"
                      checked={insuranceInput.marketplaceEnrollment}
                      onChange={(e) => setInsuranceInput({...insuranceInput, marketplaceEnrollment: e.target.checked})}
                    />
                    <Label htmlFor="marketplaceEnrollment">Marketplace Enrollment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="medicaidEligible"
                      checked={insuranceInput.medicaidEligible}
                      onChange={(e) => setInsuranceInput({...insuranceInput, medicaidEligible: e.target.checked})}
                    />
                    <Label htmlFor="medicaidEligible">Medicaid Eligible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="medicareEligible"
                      checked={insuranceInput.medicareEligible}
                      onChange={(e) => setInsuranceInput({...insuranceInput, medicareEligible: e.target.checked})}
                    />
                    <Label htmlFor="medicareEligible">Medicare Eligible</Label>
                  </div>
                </div>
              </div>

              <Button 
                onClick={analyzeInsuranceCoverage} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Analyze Coverage
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ML Analysis Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Coverage Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insuranceResult ? (
                <div className="space-y-4">
                  {/* Coverage Prediction */}
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Coverage Prediction</h3>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {insuranceResult.coveragePrediction}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {insuranceResult.probability.toFixed(1)}% confidence level
                    </div>
                    <Badge className={getCoverageColor(insuranceResult.coveragePrediction)}>
                      Confidence: {insuranceResult.confidence.toFixed(1)}%
                    </Badge>
                  </div>

                  {/* Key Factors */}
                  {insuranceResult.factors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Key Factors
                      </h4>
                      <div className="space-y-1">
                        {insuranceResult.factors.map((factor, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {insuranceResult.recommendations.map((rec, index) => (
                        <div key={index} className="p-2 bg-green-50 rounded text-sm">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Market Trends */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Market Trends
                    </h4>
                    <div className="space-y-2">
                      {insuranceResult.marketTrends.map((trend, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{trend.trend}</span>
                            <span className="text-xs text-muted-foreground">
                              {trend.confidence}% confidence
                            </span>
                          </div>
                          <p className={`text-sm ${getImpactColor(trend.impact)}`}>
                            Impact: {trend.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Priority Alert */}
                  {insuranceResult.coveragePrediction === "Likely Uninsured" && (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        High Priority
                      </h4>
                      <p className="text-sm text-red-700">
                        Immediate action recommended to secure health insurance coverage.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete the assessment to get coverage analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Model Information */}
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Training Data</h4>
                <p>State-level insurance coverage data and demographic information</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accuracy</h4>
                <p>88% accuracy in predicting insurance coverage likelihood</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Coverage Types</h4>
                <p>Employer, Marketplace, Medicaid, Medicare, and Private insurance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
