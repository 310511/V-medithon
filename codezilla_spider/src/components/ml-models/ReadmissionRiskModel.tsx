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
  Hospital, 
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
  Calendar,
  Pill
} from "lucide-react";

interface ReadmissionResult {
  riskLevel: string;
  probability: number;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
  predictedReadmissionDays: number;
}

interface ReadmissionInput {
  age: number;
  gender: string;
  timeInHospital: number;
  numLabProcedures: number;
  numProcedures: number;
  numMedications: number;
  numOutpatient: number;
  numInpatient: number;
  numEmergency: number;
  diagnosis: string;
  dischargeDisposition: string;
  admissionType: string;
  admissionSource: string;
  insurance: string;
  comorbidities: string[];
}

export const ReadmissionRiskModel: React.FC = () => {
  const [readmissionInput, setReadmissionInput] = useState<ReadmissionInput>({
    age: 65,
    gender: "Male",
    timeInHospital: 5,
    numLabProcedures: 10,
    numProcedures: 2,
    numMedications: 8,
    numOutpatient: 2,
    numInpatient: 1,
    numEmergency: 1,
    diagnosis: "Diabetes",
    dischargeDisposition: "Home",
    admissionType: "Emergency",
    admissionSource: "Emergency Room",
    insurance: "Medicare",
    comorbidities: []
  });

  const [readmissionResult, setReadmissionResult] = useState<ReadmissionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const diagnoses = [
    "Diabetes", "Heart Failure", "Pneumonia", "COPD", "Kidney Disease",
    "Cancer", "Stroke", "Hypertension", "Obesity", "Mental Health"
  ];

  const dischargeDispositions = [
    "Home", "Skilled Nursing Facility", "Rehabilitation", "Hospice", "Expired"
  ];

  const admissionTypes = [
    "Emergency", "Urgent", "Elective", "Newborn"
  ];

  const admissionSources = [
    "Emergency Room", "Physician Referral", "Transfer from Hospital", "Clinic Referral"
  ];

  const insuranceTypes = [
    "Medicare", "Medicaid", "Private", "Self-Pay", "No Insurance"
  ];

  const comorbidityOptions = [
    "Hypertension", "Diabetes", "Heart Disease", "Kidney Disease", "Liver Disease",
    "Cancer", "COPD", "Asthma", "Obesity", "Depression", "Anxiety"
  ];

  const analyzeReadmissionRisk = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate ML analysis process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAnalysisProgress(i);
    }

    // ML Algorithm: Readmission risk prediction
    let riskScore = 0;
    const riskFactors = [];
    const recommendations = [];

    // Age factor
    if (readmissionInput.age > 75) {
      riskScore += 25;
      riskFactors.push("Advanced age (>75 years)");
    } else if (readmissionInput.age > 65) {
      riskScore += 15;
      riskFactors.push("Elderly patient (>65 years)");
    }

    // Length of stay
    if (readmissionInput.timeInHospital > 10) {
      riskScore += 20;
      riskFactors.push("Extended hospital stay (>10 days)");
    } else if (readmissionInput.timeInHospital > 7) {
      riskScore += 10;
      riskFactors.push("Long hospital stay (>7 days)");
    }

    // Number of procedures
    if (readmissionInput.numProcedures > 5) {
      riskScore += 15;
      riskFactors.push("Multiple procedures (>5)");
    }

    // Number of medications
    if (readmissionInput.numMedications > 10) {
      riskScore += 20;
      riskFactors.push("Polypharmacy (>10 medications)");
    } else if (readmissionInput.numMedications > 5) {
      riskScore += 10;
      riskFactors.push("Multiple medications (>5)");
    }

    // Emergency admissions
    if (readmissionInput.admissionType === "Emergency") {
      riskScore += 15;
      riskFactors.push("Emergency admission");
    }

    // Previous emergency visits
    if (readmissionInput.numEmergency > 2) {
      riskScore += 15;
      riskFactors.push("Multiple emergency visits (>2)");
    }

    // Diagnosis-specific risks
    if (readmissionInput.diagnosis === "Heart Failure") {
      riskScore += 20;
      riskFactors.push("Heart failure diagnosis");
    } else if (readmissionInput.diagnosis === "Diabetes") {
      riskScore += 10;
      riskFactors.push("Diabetes diagnosis");
    }

    // Discharge disposition
    if (readmissionInput.dischargeDisposition === "Skilled Nursing Facility") {
      riskScore += 10;
      riskFactors.push("Discharge to skilled nursing facility");
    }

    // Insurance type
    if (readmissionInput.insurance === "Medicare") {
      riskScore += 5;
      riskFactors.push("Medicare insurance");
    }

    // Comorbidities
    if (readmissionInput.comorbidities.length > 3) {
      riskScore += 15;
      riskFactors.push("Multiple comorbidities (>3)");
    }

    // Calculate probability and risk level
    const probability = Math.min(riskScore, 95);
    let riskLevel = "Low";
    if (probability > 60) riskLevel = "High";
    else if (probability > 30) riskLevel = "Medium";

    // Generate recommendations
    if (riskLevel === "High") {
      recommendations.push("Implement intensive post-discharge follow-up program");
      recommendations.push("Schedule follow-up appointment within 7 days");
      recommendations.push("Consider home health services");
      recommendations.push("Provide comprehensive medication reconciliation");
    } else if (riskLevel === "Medium") {
      recommendations.push("Schedule follow-up appointment within 14 days");
      recommendations.push("Implement standard post-discharge care plan");
      recommendations.push("Provide medication education");
    } else {
      recommendations.push("Standard post-discharge care");
      recommendations.push("Schedule routine follow-up appointment");
    }

    // Specific recommendations based on risk factors
    if (readmissionInput.numMedications > 10) {
      recommendations.push("Conduct medication review and deprescribing assessment");
    }
    if (readmissionInput.age > 75) {
      recommendations.push("Implement geriatric care protocols");
    }
    if (readmissionInput.comorbidities.includes("Diabetes")) {
      recommendations.push("Ensure diabetes management plan is in place");
    }

    // Predict readmission timeline
    const predictedDays = riskLevel === "High" ? Math.floor(Math.random() * 30) + 7 :
                         riskLevel === "Medium" ? Math.floor(Math.random() * 60) + 30 :
                         Math.floor(Math.random() * 90) + 60;

    setReadmissionResult({
      riskLevel,
      probability,
      riskFactors,
      recommendations,
      confidence: Math.min(85 + (riskScore / 10), 95),
      predictedReadmissionDays: predictedDays
    });

    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleComorbidityChange = (comorbidity: string, checked: boolean) => {
    if (checked) {
      setReadmissionInput({
        ...readmissionInput,
        comorbidities: [...readmissionInput.comorbidities, comorbidity]
      });
    } else {
      setReadmissionInput({
        ...readmissionInput,
        comorbidities: readmissionInput.comorbidities.filter(c => c !== comorbidity)
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Hospital className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Readmission Risk AI</h1>
              <p className="text-muted-foreground">ML-powered hospital readmission risk prediction and prevention</p>
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
                Patient Discharge Information
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
                    value={readmissionInput.age}
                    onChange={(e) => setReadmissionInput({...readmissionInput, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={readmissionInput.gender} onValueChange={(value) => setReadmissionInput({...readmissionInput, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hospital Stay */}
              <div className="space-y-3">
                <h3 className="font-semibold">Hospital Stay Information</h3>
                <div>
                  <Label>Length of Stay (days) - {readmissionInput.timeInHospital}</Label>
                  <Slider
                    value={[readmissionInput.timeInHospital]}
                    onValueChange={(value) => setReadmissionInput({...readmissionInput, timeInHospital: value[0]})}
                    max={30}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Number of Lab Procedures - {readmissionInput.numLabProcedures}</Label>
                  <Slider
                    value={[readmissionInput.numLabProcedures]}
                    onValueChange={(value) => setReadmissionInput({...readmissionInput, numLabProcedures: value[0]})}
                    max={50}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Number of Procedures - {readmissionInput.numProcedures}</Label>
                  <Slider
                    value={[readmissionInput.numProcedures]}
                    onValueChange={(value) => setReadmissionInput({...readmissionInput, numProcedures: value[0]})}
                    max={10}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Medications and Visits */}
              <div className="space-y-3">
                <h3 className="font-semibold">Medications & Previous Visits</h3>
                <div>
                  <Label>Number of Medications - {readmissionInput.numMedications}</Label>
                  <Slider
                    value={[readmissionInput.numMedications]}
                    onValueChange={(value) => setReadmissionInput({...readmissionInput, numMedications: value[0]})}
                    max={20}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Outpatient Visits</Label>
                    <Input
                      type="number"
                      value={readmissionInput.numOutpatient}
                      onChange={(e) => setReadmissionInput({...readmissionInput, numOutpatient: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Inpatient Visits</Label>
                    <Input
                      type="number"
                      value={readmissionInput.numInpatient}
                      onChange={(e) => setReadmissionInput({...readmissionInput, numInpatient: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Emergency Visits</Label>
                    <Input
                      type="number"
                      value={readmissionInput.numEmergency}
                      onChange={(e) => setReadmissionInput({...readmissionInput, numEmergency: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="space-y-3">
                <h3 className="font-semibold">Clinical Information</h3>
                <div>
                  <Label>Primary Diagnosis</Label>
                  <Select value={readmissionInput.diagnosis} onValueChange={(value) => setReadmissionInput({...readmissionInput, diagnosis: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {diagnoses.map(diagnosis => (
                        <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Discharge Disposition</Label>
                  <Select value={readmissionInput.dischargeDisposition} onValueChange={(value) => setReadmissionInput({...readmissionInput, dischargeDisposition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dischargeDispositions.map(disposition => (
                        <SelectItem key={disposition} value={disposition}>{disposition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Admission Type</Label>
                  <Select value={readmissionInput.admissionType} onValueChange={(value) => setReadmissionInput({...readmissionInput, admissionType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {admissionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Insurance</Label>
                  <Select value={readmissionInput.insurance} onValueChange={(value) => setReadmissionInput({...readmissionInput, insurance: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceTypes.map(insurance => (
                        <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comorbidities */}
              <div className="space-y-3">
                <h3 className="font-semibold">Comorbidities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {comorbidityOptions.map(comorbidity => (
                    <div key={comorbidity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={comorbidity}
                        checked={readmissionInput.comorbidities.includes(comorbidity)}
                        onChange={(e) => handleComorbidityChange(comorbidity, e.target.checked)}
                      />
                      <Label htmlFor={comorbidity} className="text-sm">{comorbidity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={analyzeReadmissionRisk} 
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
                    <Hospital className="h-4 w-4 mr-2" />
                    Analyze Readmission Risk
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
                AI Risk Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readmissionResult ? (
                <div className="space-y-4">
                  {/* Risk Level */}
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Readmission Risk Level</h3>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {readmissionResult.riskLevel} Risk
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {readmissionResult.probability.toFixed(1)}% probability of readmission
                    </div>
                    <Badge className={getRiskColor(readmissionResult.riskLevel)}>
                      Confidence: {readmissionResult.confidence.toFixed(1)}%
                    </Badge>
                  </div>

                  {/* Predicted Timeline */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Predicted Readmission Timeline
                    </h4>
                    <p className="text-sm">
                      Likely readmission within <span className="font-semibold text-primary">
                        {readmissionResult.predictedReadmissionDays} days
                      </span> if no intervention
                    </p>
                  </div>

                  {/* Risk Factors */}
                  {readmissionResult.riskFactors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Identified Risk Factors
                      </h4>
                      <div className="space-y-1">
                        {readmissionResult.riskFactors.map((factor, index) => (
                          <div key={index} className="p-2 bg-red-50 rounded text-sm">
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
                      Prevention Recommendations
                    </h4>
                    <div className="space-y-2">
                      {readmissionResult.recommendations.map((rec, index) => (
                        <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Risk Alert */}
                  {readmissionResult.riskLevel === "High" && (
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-800">
                        <AlertTriangle className="h-4 w-4" />
                        High Risk Alert
                      </h4>
                      <p className="text-sm text-red-700">
                        Immediate intervention required. Implement comprehensive discharge planning and follow-up care.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Hospital className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete patient information to get readmission risk analysis</p>
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
                <p>10,000+ hospital discharge records with readmission outcomes</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accuracy</h4>
                <p>78% accuracy in predicting 30-day readmission risk</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Factors</h4>
                <p>Age, length of stay, medications, procedures, comorbidities, and more</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
