import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Pill, CheckCircle, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormulaUploadProps {
  onFormulaUploaded: (formula: any) => void;
}

export function FormulaUpload({ onFormulaUploaded }: FormulaUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formulaData, setFormulaData] = useState({
    title: "",
    description: "",
    concentration: "",
    ingredients: "",
    procedure: "",
    storageInfo: "",
    beyondUseDate: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulaData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formulaData.title || !formulaData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the title and description of the formula.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create the formula object
      const newFormula = {
        id: Date.now(), // Temporary ID
        title: formulaData.title,
        description: formulaData.description,
        category: "formulas",
        version: "1.0",
        lastUpdated: new Date().toISOString().split('T')[0],
        format: selectedFile ? selectedFile.name.split('.').pop() : "docx",
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
        // Additional formula-specific data
        concentration: formulaData.concentration,
        ingredientsList: formulaData.ingredients,
        procedureDetails: formulaData.procedure,
        storage: formulaData.storageInfo,
        beyondUseDate: formulaData.beyondUseDate,
        fileAttached: selectedFile !== null
      };

      // Here you would normally upload the file to a server
      // For now, we'll simulate a successful upload
      setTimeout(() => {
        setIsUploading(false);
        
        toast({
          title: "Formula Uploaded",
          description: "Your compounding formula has been successfully added.",
          variant: "default"
        });
        
        // Clear the form
        setFormulaData({
          title: "",
          description: "",
          concentration: "",
          ingredients: "",
          procedure: "",
          storageInfo: "",
          beyondUseDate: ""
        });
        setSelectedFile(null);
        
        // Pass the new formula back to the parent component
        onFormulaUploaded(newFormula);
      }, 1500);
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your formula. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="mr-2 h-5 w-5 text-teal-500" />
          Upload Compounding Formula
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Formula Name*</Label>
              <Input
                id="title"
                name="title"
                value={formulaData.title}
                onChange={handleInputChange}
                placeholder="e.g., Vancomycin 25mg/mL Oral Solution"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concentration">Concentration/Strength</Label>
              <Input
                id="concentration"
                name="concentration"
                value={formulaData.concentration}
                onChange={handleInputChange}
                placeholder="e.g., 25mg/mL"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description/Purpose*</Label>
            <Textarea
              id="description"
              name="description"
              value={formulaData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe what this formula is used for..."
              rows={2}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              name="ingredients"
              value={formulaData.ingredients}
              onChange={handleInputChange}
              placeholder="List the ingredients and their quantities..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="procedure">Compounding Procedure</Label>
            <Textarea
              id="procedure"
              name="procedure"
              value={formulaData.procedure}
              onChange={handleInputChange}
              placeholder="Describe the compounding steps..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storageInfo">Storage Requirements</Label>
              <Input
                id="storageInfo"
                name="storageInfo"
                value={formulaData.storageInfo}
                onChange={handleInputChange}
                placeholder="e.g., Refrigerate at 2-8°C"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beyondUseDate">Beyond-Use Date</Label>
              <Input
                id="beyondUseDate"
                name="beyondUseDate"
                value={formulaData.beyondUseDate}
                onChange={handleInputChange}
                placeholder="e.g., 14 days when refrigerated"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Attach Formula Document (optional)</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 text-center">
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <FileUp className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, or DOCX (Max 10MB)
                  </p>
                  {selectedFile && (
                    <div className="mt-2 flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Pill className="mr-2 h-4 w-4" />
                Add Compounding Formula
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}