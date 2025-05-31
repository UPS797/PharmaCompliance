import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, InfoIcon, Save, CheckCircle } from "lucide-react";

export interface RiskAssessment {
  id?: number;
  title: string;
  description: string;
  usp_chapter: string;
  requirement_id?: number;
  likelihood: number;
  impact: number;
  risk_level?: number; // Calculated from likelihood × impact
  detection_difficulty: number;
  current_controls: string;
  mitigation_plan: string;
  mitigation_status: "Not Started" | "In Progress" | "Implemented" | "Verified";
  owner?: string;
  due_date?: string;
  created_date?: string;
  updated_date?: string;
}

interface RiskAssessmentFormProps {
  initialData?: Partial<RiskAssessment>;
  onSave: (data: RiskAssessment) => void;
  onCancel?: () => void;
  requirements?: { id: number; title: string; chapter: string }[];
  isSubmitting?: boolean;
}

export function RiskAssessmentForm({
  initialData,
  onSave,
  onCancel,
  requirements = [],
  isSubmitting = false
}: RiskAssessmentFormProps) {
  const [formData, setFormData] = useState<Partial<RiskAssessment>>(
    initialData || {
      title: "",
      description: "",
      usp_chapter: "795",
      likelihood: 3,
      impact: 3,
      detection_difficulty: 3,
      current_controls: "",
      mitigation_plan: "",
      mitigation_status: "Not Started"
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate risk level
  const riskLevel = (formData.likelihood || 0) * (formData.impact || 0);
  
  // Helper functions for risk assessment
  const getRiskLevelLabel = (level: number) => {
    if (level >= 15) return "Critical";
    if (level >= 8) return "High";
    if (level >= 3) return "Moderate";
    return "Low";
  };
  
  const getRiskLevelColor = (level: number) => {
    if (level >= 15) return "text-danger-600 dark:text-danger-500";
    if (level >= 8) return "text-warning-600 dark:text-warning-500";
    if (level >= 3) return "text-yellow-600 dark:text-yellow-500";
    return "text-success-600 dark:text-success-500";
  };
  
  // Handle change to form inputs
  const handleChange = (field: keyof RiskAssessment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Risk title is required";
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.usp_chapter) {
      newErrors.usp_chapter = "USP Chapter is required";
    }
    
    if (!formData.mitigation_plan?.trim()) {
      newErrors.mitigation_plan = "Mitigation plan is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Calculate final risk level
    const finalData = {
      ...formData,
      risk_level: riskLevel,
    } as RiskAssessment;
    
    onSave(finalData);
  };
  
  // Filter requirements by selected USP chapter
  const filteredRequirements = formData.usp_chapter 
    ? requirements.filter(req => req.chapter === formData.usp_chapter)
    : requirements;
  
  return (
    <Card className="shadow-sm max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Risk Assessment" : "New Risk Assessment"}</CardTitle>
        <CardDescription>
          Identify, analyze, and plan mitigation for compliance risks
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Risk Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Risk Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Risk Title <span className="text-danger-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter a clear, specific title for the risk"
                  className={errors.title ? "border-danger-500" : ""}
                />
                {errors.title && (
                  <div className="text-sm text-danger-500">{errors.title}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usp_chapter">
                  USP Chapter <span className="text-danger-500">*</span>
                </Label>
                <Select
                  value={formData.usp_chapter}
                  onValueChange={(value) => handleChange("usp_chapter", value)}
                >
                  <SelectTrigger id="usp_chapter" className={errors.usp_chapter ? "border-danger-500" : ""}>
                    <SelectValue placeholder="Select USP Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="795">USP 795 (Non-sterile Compounding)</SelectItem>
                    <SelectItem value="797">USP 797 (Sterile Compounding)</SelectItem>
                    <SelectItem value="800">USP 800 (Hazardous Drugs)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.usp_chapter && (
                  <div className="text-sm text-danger-500">{errors.usp_chapter}</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirement_id">
                Related Requirement
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Select the specific USP requirement related to this risk.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select
                value={formData.requirement_id?.toString() || ""}
                onValueChange={(value) => handleChange("requirement_id", parseInt(value))}
              >
                <SelectTrigger id="requirement_id">
                  <SelectValue placeholder="Select a requirement (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None / General</SelectItem>
                  {filteredRequirements.map((req) => (
                    <SelectItem key={req.id} value={req.id.toString()}>
                      {req.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Risk Description <span className="text-danger-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the risk in detail, including potential consequences"
                className={`min-h-[100px] ${errors.description ? "border-danger-500" : ""}`}
              />
              {errors.description && (
                <div className="text-sm text-danger-500">{errors.description}</div>
              )}
            </div>
          </div>
          
          {/* Risk Assessment */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Risk Assessment</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risk Level:</span>
                <span className={`font-bold ${getRiskLevelColor(riskLevel)}`}>
                  {riskLevel} - {getRiskLevelLabel(riskLevel)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="likelihood">
                      Likelihood
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 inline-block ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">How likely is this risk to occur?</p>
                            <p className="mt-1">1 - Very Unlikely, 5 - Almost Certain</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="font-medium">{formData.likelihood}</span>
                  </div>
                  <Slider
                    id="likelihood"
                    value={[formData.likelihood || 3]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleChange("likelihood", value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                    <span>Very Unlikely</span>
                    <span>Almost Certain</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="impact">
                      Impact
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 inline-block ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">How severe would the impact be if this risk occurs?</p>
                            <p className="mt-1">1 - Negligible, 5 - Critical</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="font-medium">{formData.impact}</span>
                  </div>
                  <Slider
                    id="impact"
                    value={[formData.impact || 3]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleChange("impact", value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                    <span>Negligible</span>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="detection_difficulty">
                      Detection Difficulty
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 inline-block ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">How difficult is it to detect this risk before it causes problems?</p>
                            <p className="mt-1">1 - Easily Detectable, 5 - Very Difficult to Detect</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="font-medium">{formData.detection_difficulty}</span>
                  </div>
                  <Slider
                    id="detection_difficulty"
                    value={[formData.detection_difficulty || 3]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleChange("detection_difficulty", value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                    <span>Easily Detectable</span>
                    <span>Hard to Detect</span>
                  </div>
                </div>
                
                <div className="mt-6 p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${getRiskLevelColor(riskLevel)}`} />
                    <span className="font-medium">Risk Rating</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Likelihood:</span>
                      <span className="font-medium">{formData.likelihood} / 5</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Impact:</span>
                      <span className="font-medium">{formData.impact} / 5</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Detection Difficulty:</span>
                      <span className="font-medium">{formData.detection_difficulty} / 5</span>
                    </div>
                    <div className="flex justify-between py-1 mt-1">
                      <span className="font-medium">Overall Risk Score:</span>
                      <span className={`font-bold ${getRiskLevelColor(riskLevel)}`}>
                        {riskLevel} ({getRiskLevelLabel(riskLevel)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls and Mitigation */}
          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium pt-2">Controls and Mitigation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="current_controls">
                Current Controls
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Describe any existing measures in place to address this risk.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea
                id="current_controls"
                value={formData.current_controls || ""}
                onChange={(e) => handleChange("current_controls", e.target.value)}
                placeholder="Describe any existing controls or measures currently in place"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mitigation_plan">
                Mitigation Plan <span className="text-danger-500">*</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Describe the plan to mitigate this risk, including specific actions to be taken.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea
                id="mitigation_plan"
                value={formData.mitigation_plan || ""}
                onChange={(e) => handleChange("mitigation_plan", e.target.value)}
                placeholder="Describe specific actions to mitigate this risk"
                className={`min-h-[120px] ${errors.mitigation_plan ? "border-danger-500" : ""}`}
              />
              {errors.mitigation_plan && (
                <div className="text-sm text-danger-500">{errors.mitigation_plan}</div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mitigation Status
                </Label>
                <RadioGroup
                  value={formData.mitigation_status}
                  onValueChange={(value) => 
                    handleChange("mitigation_status", value as "Not Started" | "In Progress" | "Implemented" | "Verified")
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Not Started" id="not-started" />
                    <Label htmlFor="not-started" className="cursor-pointer">Not Started</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="In Progress" id="in-progress" />
                    <Label htmlFor="in-progress" className="cursor-pointer">In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Implemented" id="implemented" />
                    <Label htmlFor="implemented" className="cursor-pointer">Implemented</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Verified" id="verified" />
                    <Label htmlFor="verified" className="cursor-pointer">Verified</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">
                    Mitigation Owner
                  </Label>
                  <Input
                    id="owner"
                    value={formData.owner || ""}
                    onChange={(e) => handleChange("owner", e.target.value)}
                    placeholder="Person responsible for mitigation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due_date">
                    Target Completion Date
                  </Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date || ""}
                    onChange={(e) => handleChange("due_date", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 p-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="ml-auto flex items-center gap-2"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Risk Assessment
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}