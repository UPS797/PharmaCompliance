import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pill, Sparkles, Loader2, Check, Download, Plus } from "lucide-react";

interface AIFormulaGeneratorProps {
  onFormulaGenerated: (formula: any) => void;
}

export function AIFormulaGenerator({ onFormulaGenerated }: AIFormulaGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [medicationName, setMedicationName] = useState("");
  const [medicationType, setMedicationType] = useState("suspension");
  const [concentration, setConcentration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedFormula, setGeneratedFormula] = useState<any>(null);

  // Sample medication types for the dropdown
  const medicationTypes = [
    { value: "suspension", label: "Oral Suspension" },
    { value: "solution", label: "Oral Solution" },
    { value: "capsule", label: "Capsule" },
    { value: "cream", label: "Topical Cream" },
    { value: "ointment", label: "Ointment" },
    { value: "gel", label: "Gel" },
    { value: "suppository", label: "Suppository" },
    { value: "lozenge", label: "Lozenge" },
    { value: "injection", label: "Sterile Injection" }
  ];

  // Function to generate formula from AI
  const generateFormula = async () => {
    if (!medicationName) {
      toast({
        title: "Missing Information",
        description: "Please enter a medication name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // In a real implementation, this would call your OpenAI API endpoint
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock generated formula based on user input
      const formulaData = generateMockFormula(
        medicationName, 
        medicationType, 
        concentration
      );
      
      setGeneratedFormula(formulaData);
      
      toast({
        title: "Formula Generated",
        description: `${medicationName} formula has been successfully generated`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate formula. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to add the generated formula to your templates
  const addFormulaToTemplates = () => {
    if (!generatedFormula) return;
    
    // Prepare formula for your SOP templates
    const templateFormula = {
      id: `formula-${Date.now()}`,
      title: generatedFormula.name,
      description: `${generatedFormula.concentration} ${generatedFormula.dosageForm}`,
      category: "formulas",
      version: "1.0",
      lastUpdated: new Date().toISOString().split('T')[0],
      format: "docx",
      sections: [
        "Purpose",
        "Ingredients",
        "Equipment Required",
        "Compounding Procedure",
        "Quality Checks",
        "Storage Requirements",
        "Beyond-Use Dating",
        "Patient Counseling Information"
      ],
      // Additional formula details
      ingredients: generatedFormula.ingredients,
      procedure: generatedFormula.procedure,
      storage: generatedFormula.storage,
      beyondUseDate: generatedFormula.beyondUseDate
    };
    
    // Call the callback function to add to templates
    onFormulaGenerated(templateFormula);
    
    // Reset form
    setMedicationName("");
    setMedicationType("suspension");
    setConcentration("");
    setAdditionalInfo("");
    setGeneratedFormula(null);
    
    toast({
      title: "Formula Added",
      description: "Formula has been added to your SOP templates",
    });
  };

  // Helper function to generate mock formula (this would be replaced by AI API call)
  const generateMockFormula = (medication: string, type: string, conc: string) => {
    const concentration = conc || "standard concentration";
    const dosageForm = medicationTypes.find(t => t.value === type)?.label || type;
    
    // Generate ingredients based on medication type
    let ingredients = [];
    let procedure = "";
    let storage = "";
    let beyondUseDate = "";
    
    if (type === "suspension") {
      ingredients = [
        `${medication} powder/tablets, quantity sufficient`,
        "Ora-Plus suspension vehicle, 50%",
        "Ora-Sweet syrup vehicle, 50%",
        "Purified water, as needed"
      ];
      procedure = `1. Calculate the required quantity of ${medication} based on the desired concentration (${concentration}).
2. If using tablets, crush tablets to fine powder using mortar and pestle.
3. Add small amount of Ora-Plus and form a smooth paste.
4. Gradually add remaining Ora-Plus while mixing.
5. Add Ora-Sweet in portions while continuing to mix.
6. Transfer to a graduated cylinder and QS to final volume with equal parts Ora-Plus and Ora-Sweet.
7. Transfer to appropriate dispensing container.`;
      storage = "Store in refrigerator (2-8°C) in a tight, light-resistant container";
      beyondUseDate = "14 days when refrigerated";
    } else if (type === "cream" || type === "ointment") {
      ingredients = [
        `${medication} powder, quantity sufficient`,
        "Appropriate base (e.g., white petrolatum for ointment, cold cream for cream)",
        "Propylene glycol, as needed for solubility",
        "Preservative (if needed)"
      ];
      procedure = `1. Calculate the required quantity of ${medication} based on the desired concentration (${concentration}).
2. Reduce drug to fine powder using mortar and pestle.
3. Incorporate small amount of propylene glycol to form a smooth paste.
4. Gradually incorporate the base in geometric proportions, mixing thoroughly after each addition.
5. Continue mixing until uniform.
6. Package in appropriate container.`;
      storage = "Store at controlled room temperature (15-30°C) in a tight container";
      beyondUseDate = "30 days";
    } else if (type === "capsule") {
      ingredients = [
        `${medication} powder, quantity sufficient`,
        "Lactose or microcrystalline cellulose (filler)",
        "Empty gelatin capsules, appropriate size"
      ];
      procedure = `1. Calculate the required quantity of ${medication} and filler for each capsule.
2. Mix ${medication} with appropriate amount of filler.
3. Fill capsules using capsule machine or manual method.
4. Clean exterior of capsules.
5. Package in appropriate container with desiccant.`;
      storage = "Store at controlled room temperature (15-30°C) in a tight container with desiccant";
      beyondUseDate = "180 days";
    } else if (type === "solution") {
      ingredients = [
        `${medication} powder/tablets, quantity sufficient`,
        "Vehicle appropriate for solution (water, alcohol, etc.)",
        "Buffer agents (if needed)",
        "Sweetener and flavoring (if appropriate)",
        "Preservative (if needed)"
      ];
      procedure = `1. Calculate the required quantity of ${medication} based on the desired concentration (${concentration}).
2. Dissolve medication in appropriate solvent.
3. Add buffer agents if needed to maintain stability.
4. Add sweetener and flavoring if appropriate.
5. QS to final volume with vehicle.
6. Filter if necessary.
7. Package in appropriate container.`;
      storage = "Store as appropriate for the specific medication (refrigerated or room temperature)";
      beyondUseDate = "Varies based on specific medication and preservatives used";
    }
    
    return {
      name: medication,
      dosageForm,
      concentration,
      ingredients: ingredients.join("\n"),
      procedure,
      storage,
      beyondUseDate,
      notes: additionalInfo
    };
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          AI Formula Generator
        </CardTitle>
        <CardDescription>
          Generate medication compounding formulas using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!generatedFormula ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name*</Label>
                <Input
                  id="medicationName"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="e.g., Metronidazole"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concentration">Concentration/Strength</Label>
                <Input
                  id="concentration"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  placeholder="e.g., 50mg/mL"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicationType">Dosage Form</Label>
              <Select value={medicationType} onValueChange={(value) => setMedicationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dosage form" />
                </SelectTrigger>
                <SelectContent>
                  {medicationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any specific requirements or considerations..."
                rows={3}
              />
            </div>
            
            <Button 
              onClick={generateFormula} 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Formula...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Formula
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start">
              <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">Formula Generated</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  AI has generated a compounding formula for {generatedFormula.name} {generatedFormula.concentration} {generatedFormula.dosageForm}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients:</h3>
                <div className="mt-1 whitespace-pre-line text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                  {generatedFormula.ingredients}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Compounding Procedure:</h3>
                <div className="mt-1 whitespace-pre-line text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                  {generatedFormula.procedure}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage:</h3>
                  <div className="mt-1 text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {generatedFormula.storage}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Beyond-Use Date:</h3>
                  <div className="mt-1 text-sm border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {generatedFormula.beyondUseDate}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setGeneratedFormula(null)}>
                Generate Another
              </Button>
              <Button onClick={addFormulaToTemplates}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Templates
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}