import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export interface OptimizationSuggestion {
  section: string;
  suggestion: string;
  type: "compliance" | "clarity" | "completeness";
  importance: "high" | "medium" | "low";
}

interface TemplateOptimizerProps {
  templateTitle: string;
  category: string;
  sections: { name: string; content: string }[];
  onApplySuggestion: (section: string, updatedContent: string) => void;
}

export const TemplateOptimizer: React.FC<TemplateOptimizerProps> = ({
  templateTitle,
  category,
  sections,
  onApplySuggestion,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);

  // Get the mock suggestions based on USP category and template sections
  const generateOptimizationSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate a delay for API call
    setTimeout(() => {
      const mockSuggestions = getMockSuggestions(category, sections);
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1800);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "clarity":
        return <InfoIcon className="h-4 w-4 text-blue-500" />;
      case "completeness":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "compliance":
        return "Regulatory Compliance";
      case "clarity":
        return "Clarity Improvement";
      case "completeness":
        return "Completeness Enhancement";
      default:
        return "Suggestion";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleApplySuggestion = (section: string, suggestion: string) => {
    // Find the original section content
    const sectionData = sections.find(s => s.name === section);
    if (!sectionData) return;
    
    // Create improved content by applying the suggestion
    // In a real implementation, this might use more sophisticated content merging
    const improvedContent = sectionData.content ? 
      `${sectionData.content}\n\n${suggestion}` : 
      suggestion;
    
    onApplySuggestion(section, improvedContent);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
            <CardTitle className="text-lg">AI Template Optimizer</CardTitle>
          </div>
          {!isGenerating && suggestions.length > 0 && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {suggestions.length} Suggestions
            </Badge>
          )}
        </div>
        <CardDescription>
          Get AI-powered suggestions to optimize your SOP template for clarity, completeness, and regulatory compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isGenerating && suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 mx-auto text-yellow-500 opacity-70 mb-3" />
            <h3 className="text-lg font-medium mb-1">Optimize Your SOP</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              Our AI will analyze your {templateTitle} template and suggest improvements based on USP {category.replace('usp', '').toUpperCase()} guidelines and regulatory best practices.
            </p>
            <Button 
              onClick={generateOptimizationSuggestions}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Optimization Suggestions
            </Button>
          </div>
        ) : isGenerating ? (
          <div className="space-y-4 py-3">
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="pt-3">
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <Accordion type="single" collapsible className="w-full">
              {suggestions.map((suggestion, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg mb-2 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center text-left">
                      <div className="mr-3">
                        {getTypeIcon(suggestion.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{suggestion.section}</h4>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className={`mr-2 text-xs ${getImportanceColor(suggestion.importance)}`}>
                            {suggestion.importance.charAt(0).toUpperCase() + suggestion.importance.slice(1)} Priority
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getTypeLabel(suggestion.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md mb-3 text-sm">
                      {suggestion.suggestion}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion.section, suggestion.suggestion)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      Apply This Suggestion
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
      {!isGenerating && suggestions.length > 0 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() => setSuggestions([])}
          >
            Clear All Suggestions
          </Button>
          <Button 
            onClick={generateOptimizationSuggestions}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Regenerate Suggestions
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Generate mock suggestions based on template category and sections
function getMockSuggestions(category: string, sections: { name: string; content: string }[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // Common suggestions across all USP chapters
  const commonSuggestions = [
    {
      section: "Purpose and Scope",
      suggestion: "Consider expanding this section to explicitly reference the specific USP chapter guidelines being followed. For example: 'This SOP is designed to ensure compliance with USP Chapter <X> requirements for <specific process>'.",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Responsibilities",
      suggestion: "For clearer accountability, specify which staff roles are responsible for documentation retention and how long records must be maintained according to regulatory requirements.",
      type: "clarity" as const,
      importance: "medium" as const
    },
    {
      section: "Documentation",
      suggestion: "Include specific form templates or references to standardized documentation that should be used for record-keeping. This ensures consistency and regulatory compliance.",
      type: "completeness" as const,
      importance: "medium" as const
    }
  ];

  // USP 797 specific suggestions for sterile compounding
  const usp797Suggestions = [
    {
      section: "Personnel Qualifications and Training",
      suggestion: "Specify required hand hygiene procedures, including detailed steps for washing and the use of appropriate sanitizing agents before entering the compounding area. Reference USP 797 Section 4.1 on Hand Hygiene.",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Facilities and Environmental Controls",
      suggestion: "Include specific requirements for primary engineering controls (PECs) and secondary engineering controls (SECs) according to the latest USP 797 guidelines, including recommended air exchanges per hour and pressure differentials.",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Cleaning and Disinfection",
      suggestion: "Specify that cleaning agents should be selected based on their effectiveness against the microorganisms of concern and rotated periodically to prevent development of resistant strains.",
      type: "completeness" as const,
      importance: "medium" as const
    },
    {
      section: "Aseptic Technique",
      suggestion: "Include specific requirements for media-fill testing frequency based on risk level of compounding activities (low, medium, high) and acceptance criteria for results.",
      type: "compliance" as const,
      importance: "high" as const
    }
  ];

  // USP 800 specific suggestions for hazardous drugs
  const usp800Suggestions = [
    {
      section: "Personal Protective Equipment",
      suggestion: "Specify that all PPE used for HD handling must meet ASTM standards. Include details on proper donning and doffing sequence to minimize contamination risk.",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Facility Requirements",
      suggestion: "Include detailed specifications for the negative pressure room requirements (minimum of 12 air changes per hour and negative pressure between 0.01 and 0.03 inches of water column relative to adjacent areas).",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Spill Management",
      suggestion: "Specify that spill kits must be readily available in all areas where HDs are handled and include a detailed list of required contents as per USP 800 guidelines.",
      type: "completeness" as const,
      importance: "high" as const
    }
  ];

  // USP 795 specific suggestions for non-sterile compounding
  const usp795Suggestions = [
    {
      section: "Beyond-Use Dating",
      suggestion: "Include specific criteria for assigning appropriate beyond-use dates based on water activity, aqueous vs. non-aqueous formulations, and packaging/storage conditions as specified in USP 795.",
      type: "compliance" as const,
      importance: "high" as const
    },
    {
      section: "Quality Control",
      suggestion: "Add specific physical quality tests (appearance, pH, weight variation) that should be performed and documented before dispensing non-sterile preparations.",
      type: "completeness" as const,
      importance: "medium" as const
    }
  ];

  // General suggestions
  const generalSuggestions = [
    {
      section: "Training Requirements",
      suggestion: "Specify that all training activities should be documented with date, content covered, and competency assessment results. Include requirement for annual refresher training.",
      type: "compliance" as const,
      importance: "medium" as const
    },
    {
      section: "Monitoring Requirements",
      suggestion: "Add specific frequency requirements for monitoring activities and define the acceptable ranges for each parameter being monitored.",
      type: "clarity" as const,
      importance: "medium" as const
    }
  ];

  // Add relevant suggestions based on the template category
  if (category === "usp797") {
    suggestions.push(...usp797Suggestions);
  } else if (category === "usp800") {
    suggestions.push(...usp800Suggestions);
  } else if (category === "usp795") {
    suggestions.push(...usp795Suggestions);
  } else if (category === "general") {
    suggestions.push(...generalSuggestions);
  }

  // Add common suggestions based on the sections that exist in the template
  for (const commonSuggestion of commonSuggestions) {
    const sectionExists = sections.some(s => s.name.includes(commonSuggestion.section));
    if (sectionExists) {
      suggestions.push(commonSuggestion);
    }
  }

  // Filter out suggestions for sections that don't exist in this template
  const filteredSuggestions = suggestions.filter(suggestion => {
    return sections.some(section => section.name.includes(suggestion.section));
  });

  // Sort by importance: high > medium > low
  return filteredSuggestions.sort((a, b) => {
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });
}