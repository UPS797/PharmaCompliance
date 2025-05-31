import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  BarChart2,
  ClipboardList,
  FileCheck,
  Shield,
  Thermometer,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Lightbulb,
  Sparkles,
  Pill,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define template categories
const templateCategories = [
  { id: "usp795", name: "USP 795 - Non-sterile Compounding" },
  { id: "usp797", name: "USP 797 - Sterile Compounding" },
  { id: "usp800", name: "USP 800 - Hazardous Drugs" },
  { id: "usp825", name: "USP 825 - Radiopharmaceuticals" },
  { id: "general", name: "General Pharmacy Procedures" },
  { id: "nonsterile", name: "Non-sterile Formulas" },
  { id: "sterile", name: "Sterile Formulas" },
  { id: "hazardous", name: "Hazardous/Chemo Formulas" },
];

// Define category icon function
function getCategoryIcon(category: string) {
  switch (category) {
    case "usp795":
      return <ClipboardList className="h-5 w-5 text-orange-500" />;
    case "usp797":
      return <FileCheck className="h-5 w-5 text-blue-500" />;
    case "usp800":
      return <Shield className="h-5 w-5 text-red-500" />;
    case "usp825":
      return <BarChart2 className="h-5 w-5 text-purple-500" />;
    case "general":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case "nonsterile":
      return <Pill className="h-5 w-5 text-teal-500" />;
    case "sterile":
      return <Pill className="h-5 w-5 text-blue-500" />;
    case "hazardous":
      return <Pill className="h-5 w-5 text-red-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
}

// Define mock templates
const sopTemplates = [
  // USP 795 Templates
  {
    id: 1,
    title: "Non-sterile Compounding Procedures",
    description: "Standard procedures for compounding non-sterile preparations",
    category: "usp795",
    version: "2.1",
    lastUpdated: "2023-04-15",
    format: "docx",
    sections: [
      "Purpose and Scope",
      "Personnel Qualifications",
      "Facilities and Equipment",
      "Documentation Requirements",
      "Quality Control",
      "Beyond-Use Dating",
    ],
  },
  {
    id: 2,
    title: "Quality Assurance for Non-sterile Preparations",
    description: "QA procedures for non-sterile compound verification",
    category: "usp795",
    version: "1.5",
    lastUpdated: "2023-05-10",
    format: "docx",
    sections: [
      "Purpose",
      "Verification Process",
      "Documentation",
      "Personnel Training",
      "Corrective Actions",
    ],
  },
  
  // USP 797 Templates
  {
    id: 3,
    title: "Sterile Compounding Procedures",
    description: "Comprehensive procedures for sterile preparation compounding",
    category: "usp797",
    version: "3.2",
    lastUpdated: "2023-06-12",
    format: "docx",
    sections: [
      "Purpose and Scope",
      "Personnel Qualifications and Training",
      "Facilities and Environmental Controls",
      "Cleaning and Disinfection",
      "Equipment Calibration",
      "Aseptic Technique",
      "Quality Assurance Procedures",
    ],
  },
  {
    id: 4,
    title: "Environmental Monitoring Protocol",
    description: "Procedures for monitoring the sterile compounding environment",
    category: "usp797",
    version: "2.4",
    lastUpdated: "2023-05-28",
    format: "docx",
    sections: [
      "Purpose",
      "Frequency of Testing",
      "Sampling Locations",
      "Test Methods",
      "Action Levels",
      "Documentation",
      "Corrective Actions",
    ],
  },
  {
    id: 5,
    title: "Personnel Hand Hygiene and Garbing",
    description: "Procedures for proper hand hygiene and garbing for sterile compounding",
    category: "usp797",
    version: "1.8",
    lastUpdated: "2023-04-20",
    format: "docx",
    sections: [
      "Purpose",
      "Hand Hygiene Procedure",
      "Garbing Sequence",
      "Monitoring Compliance",
      "Documentation",
    ],
  },
  
  // USP 800 Templates
  {
    id: 6,
    title: "Hazardous Drug Handling",
    description: "Procedures for safe handling of hazardous drugs",
    category: "usp800",
    version: "2.5",
    lastUpdated: "2023-07-05",
    format: "docx",
    sections: [
      "Purpose and Scope",
      "Responsibilities",
      "List of Hazardous Drugs",
      "Facility Requirements",
      "Personal Protective Equipment",
      "Handling Procedures",
      "Spill Management",
      "Waste Disposal",
    ],
  },
  {
    id: 7,
    title: "Hazardous Drug Spill Management",
    description: "Procedures for managing hazardous drug spills",
    category: "usp800",
    version: "1.6",
    lastUpdated: "2023-03-18",
    format: "docx",
    sections: [
      "Purpose",
      "Spill Kit Contents",
      "Spill Response Procedure",
      "Documentation",
      "Personnel Training",
    ],
  },
  
  // USP 825 Templates
  {
    id: 8,
    title: "Radiopharmaceutical Preparation",
    description: "Procedures for preparation of radiopharmaceuticals",
    category: "usp825",
    version: "1.3",
    lastUpdated: "2023-02-22",
    format: "docx",
    sections: [
      "Purpose and Scope",
      "Personnel Requirements",
      "Facilities and Equipment",
      "Aseptic Techniques",
      "Quality Control Testing",
      "Documentation",
    ],
  },
  
  // Medication Compounding Formulas
  // Non-sterile Compounding Formulas
  {
    id: 13,
    title: "Magic Mouthwash Compound",
    description: "Standard formula and preparation procedures for Magic Mouthwash compound for oral mucositis",
    category: "nonsterile",
    version: "2.1",
    lastUpdated: "2023-05-12",
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
  },
  {
    id: 14,
    title: "Pediatric Omeprazole Suspension",
    description: "Formula and preparation protocol for pediatric omeprazole oral suspension",
    category: "nonsterile",
    version: "1.8",
    lastUpdated: "2023-06-08",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Quality Checks",
      "Stability Information",
      "Storage Requirements",
      "Patient/Caregiver Instructions"
    ],
  },
  {
    id: 15,
    title: "Progesterone Vaginal Suppositories",
    description: "Formula and compounding protocol for progesterone vaginal suppositories",
    category: "nonsterile",
    version: "2.3",
    lastUpdated: "2023-04-15",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Mold Selection and Preparation",
      "Quality Checks",
      "Packaging",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Instructions"
    ],
  },
  {
    id: 16,
    title: "Ketoprofen-Lidocaine-Cyclobenzaprine Topical Gel",
    description: "Formula and preparation instructions for compounded analgesic topical gel",
    category: "nonsterile",
    version: "1.5",
    lastUpdated: "2023-05-22",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Quality Checks",
      "Packaging Options",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Instructions and Precautions"
    ],
  },
  {
    id: 17,
    title: "Tacrolimus 0.1% Ointment",
    description: "Formula and preparation procedures for tacrolimus topical ointment",
    category: "nonsterile", 
    version: "1.2",
    lastUpdated: "2023-03-18",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Quality Checks",
      "Packaging",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Instructions"
    ],
  },
  {
    id: 18,
    title: "Metronidazole 0.75% Gel",
    description: "Formula and compounding procedures for metronidazole topical gel",
    category: "nonsterile",
    version: "2.0",
    lastUpdated: "2023-07-14",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Quality Assessment",
      "Packaging Options",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Counseling Information"
    ],
  },
  {
    id: 19,
    title: "Vancomycin 25mg/mL Oral Solution",
    description: "Formula and preparation protocol for vancomycin oral solution for C. difficile infection",
    category: "nonsterile",
    version: "1.9",
    lastUpdated: "2023-07-22",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Compounding Procedure",
      "Quality Checks",
      "Stability Data",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient/Caregiver Instructions"
    ],
  },
  
  // Sterile Compounding Formulas
  {
    id: 21,
    title: "Hydroxyprogesterone Caproate 250mg/mL Injection",
    description: "Formula and compounding protocol for hydroxyprogesterone caproate sterile injection",
    category: "sterile",
    version: "2.2",
    lastUpdated: "2023-08-10",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "USP <797> Requirements",
      "Sterile Compounding Procedure",
      "Sterilization Method",
      "Quality Control Testing",
      "Packaging",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Counseling Information"
    ],
  },
  {
    id: 23,
    title: "Cefazolin 100mg/mL Ophthalmic Solution",
    description: "Formula and preparation protocol for sterile cefazolin ophthalmic solution",
    category: "sterile",
    version: "1.6",
    lastUpdated: "2023-07-01",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "USP <797> Requirements",
      "Clean Room Preparation",
      "Sterile Compounding Procedure",
      "Sterilization Method",
      "Quality Control Testing",
      "Packaging",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Instructions"
    ],
  },
  
  // Hazardous/Chemo Compounding Formulas
  {
    id: 20,
    title: "Methotrexate 2.5mg/mL Oral Solution",
    description: "Formula and preparation protocol for methotrexate oral solution for pediatric oncology",
    category: "hazardous",
    version: "3.1",
    lastUpdated: "2023-05-05",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "Safety Precautions",
      "Compounding Procedure",
      "Quality Checks",
      "Stability Information",
      "Storage Requirements",
      "Handling Precautions",
      "Patient/Caregiver Instructions"
    ],
  },
  {
    id: 24,
    title: "Cyclophosphamide 20mg/mL Solution for Injection",
    description: "Formula and preparation protocol for cyclophosphamide sterile injection",
    category: "hazardous",
    version: "2.4",
    lastUpdated: "2023-06-12",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "USP <800> Requirements",
      "Personal Protective Equipment",
      "CSTD Usage",
      "Sterile Compounding Procedure",
      "Containment Verification",
      "Quality Control Testing",
      "Waste Disposal Protocol",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Administration Precautions"
    ],
  },
  {
    id: 25,
    title: "Fluorouracil 50mg/mL Topical Solution",
    description: "Formula and preparation protocol for fluorouracil topical solution",
    category: "hazardous",
    version: "1.7",
    lastUpdated: "2023-08-20",
    format: "docx",
    sections: [
      "Purpose",
      "Ingredients",
      "Equipment Required",
      "USP <800> Requirements",
      "Personal Protective Equipment",
      "Compounding Procedure",
      "Containment Verification",
      "Quality Checks",
      "Packaging",
      "Waste Disposal Protocol",
      "Storage Requirements",
      "Beyond-Use Dating",
      "Patient Instructions and Precautions"
    ],
  },
  // General Templates
  {
    id: 9,
    title: "Staff Training Protocol",
    description: "Procedure for staff training and competency assessment",
    category: "general",
    version: "1.7",
    lastUpdated: "2023-04-03",
    format: "docx",
    sections: [
      "Purpose",
      "Training Requirements",
      "Competency Assessment",
      "Documentation",
      "Periodic Reassessment",
    ],
  },
  {
    id: 10,
    title: "Equipment Cleaning and Maintenance",
    description: "Procedures for cleaning and maintaining pharmacy equipment",
    category: "general",
    version: "2.0",
    lastUpdated: "2023-05-15",
    format: "docx",
    sections: [
      "Purpose",
      "Cleaning Schedules",
      "Cleaning Procedures",
      "Maintenance Procedures",
      "Documentation",
    ],
  },
  {
    id: 11,
    title: "Temperature Monitoring",
    description: "Procedures for monitoring temperatures in storage areas",
    category: "general",
    version: "1.4",
    lastUpdated: "2023-03-30",
    format: "docx",
    sections: [
      "Purpose",
      "Monitoring Requirements",
      "Temperature Ranges",
      "Out of Range Procedures",
      "Documentation",
    ],
  },
  {
    id: 12,
    title: "Pharmacy Incident Reporting",
    description: "Procedure for reporting and managing pharmacy incidents",
    category: "general",
    version: "1.9",
    lastUpdated: "2023-06-08",
    format: "docx",
    sections: [
      "Purpose",
      "Types of Incidents",
      "Reporting Procedure",
      "Root Cause Analysis",
      "Corrective Actions",
      "Documentation",
    ],
  },
];

interface SopTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  version: string;
  lastUpdated: string;
  format: string;
  sections: string[];
}

interface TemplatePreviewProps {
  template: SopTemplate;
  onClose: () => void;
  onCustomize: (template: SopTemplate) => void;
}

// Template Preview Component
const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onClose,
  onCustomize,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b mb-4">
        <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
          SOP Template Preview: {template.title}
        </p>
      </div>
      
      <div className="overflow-y-auto">
        <div className="max-w-3xl mx-auto border border-gray-200 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-2">STANDARD OPERATING PROCEDURE</h1>
            <h2 className="text-lg font-semibold mb-4">{template.title}</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-left">
                <p><span className="font-medium">SOP Number:</span> SOP-{template.category.toUpperCase()}-{template.id}</p>
                <p><span className="font-medium">Version:</span> {template.version}</p>
              </div>
              <div className="text-right">
                <p><span className="font-medium">Effective Date:</span> {template.lastUpdated}</p>
                <p><span className="font-medium">Review Date:</span> {new Date(new Date(template.lastUpdated).setFullYear(new Date(template.lastUpdated).getFullYear() + 1)).toISOString().split('T')[0]}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold border-b pb-1 mb-2">1. PURPOSE</h3>
            <p className="text-sm">This Standard Operating Procedure (SOP) outlines the process for {template.description.toLowerCase()}.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold border-b pb-1 mb-2">2. SCOPE</h3>
            <p className="text-sm">This SOP applies to all pharmacy staff involved in {template.title.toLowerCase()}.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold border-b pb-1 mb-2">3. RESPONSIBILITIES</h3>
            <p className="text-sm mb-2">The following personnel are responsible for implementing this SOP:</p>
            <ul className="list-disc list-inside text-sm">
              <li>Pharmacy Director: Overall responsibility for SOP implementation</li>
              <li>Pharmacists: Oversight of procedures and verification</li>
              <li>Pharmacy Technicians: Execution of procedures as defined</li>
              <li>Quality Assurance Personnel: Monitoring compliance</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold border-b pb-1 mb-2">4. PROCEDURES</h3>
            <p className="text-sm mb-2">This SOP includes the following sections:</p>
            <ol className="list-decimal list-inside text-sm">
              {template.sections.map((section, index) => (
                <li key={index} className="mb-1">{section}</li>
              ))}
            </ol>
            <p className="text-sm italic mt-2">Note: This is a template. Detailed procedures for each section should be added when customizing this SOP.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-semibold border-b pb-1 mb-2">5. REFERENCES</h3>
            <ul className="list-disc list-inside text-sm">
              <li>USP {template.category.replace('usp', '').toUpperCase()} Guidelines</li>
              <li>State Board of Pharmacy Regulations</li>
              <li>Facility Policies and Procedures</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold border-b pb-1 mb-2">6. APPROVAL</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4 text-sm">
              <div>
                <p className="font-medium">Prepared By:</p>
                <div className="h-8 border-b border-dashed border-gray-300 dark:border-gray-600 mt-4"></div>
                <p className="mt-1">Name/Title/Date</p>
              </div>
              <div>
                <p className="font-medium">Reviewed By:</p>
                <div className="h-8 border-b border-dashed border-gray-300 dark:border-gray-600 mt-4"></div>
                <p className="mt-1">Name/Title/Date</p>
              </div>
              <div>
                <p className="font-medium">Quality Assurance:</p>
                <div className="h-8 border-b border-dashed border-gray-300 dark:border-gray-600 mt-4"></div>
                <p className="mt-1">Name/Title/Date</p>
              </div>
              <div>
                <p className="font-medium">Approved By:</p>
                <div className="h-8 border-b border-dashed border-gray-300 dark:border-gray-600 mt-4"></div>
                <p className="mt-1">Name/Title/Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end p-4 space-x-2 border-t">
        <Button variant="outline" onClick={onClose}>
          Close Preview
        </Button>
        <Button variant="default" onClick={() => onCustomize(template)}>
          Customize Template
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>
    </div>
  );
};

interface OptimizationSuggestion {
  section: string;
  suggestion: string;
  type: "compliance" | "clarity" | "completeness";
  importance: "high" | "medium" | "low";
}

interface TemplateCustomizeProps {
  template: SopTemplate;
  onClose: () => void;
  onSave: (pharmacy: string) => void;
}

// Not using the external TemplateOptimizer component for simplicity

// Template Customization Component
const TemplateCustomize: React.FC<TemplateCustomizeProps> = ({
  template,
  onClose,
  onSave,
}) => {
  const [templateData, setTemplateData] = useState({
    title: template.title,
    description: template.description,
    pharmacy: "",
    sopNumber: `SOP-${template.category.toUpperCase()}-${template.id}`,
    effectiveDate: new Date().toISOString().split('T')[0],
    preparedBy: "",
    reviewedBy: "",
    approvedBy: "",
  });
  
  const [activeTab, setActiveTab] = useState<"edit" | "optimize">("edit");
  const [sectionContent, setSectionContent] = useState<{[key: string]: string}>({});
  
  // Expose the customizing template state setter to be used in template customization
  const setCustomizingTemplate = useCustomizingTemplate => {
    // This is a reference to the external state setter function
    onSave(templateData.pharmacy);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplateData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (section: string, content: string) => {
    setSectionContent(prev => ({ ...prev, [section]: content }));
  };

  // Adding suggestions directly to sections
  // Initialize section content for template sections
  React.useEffect(() => {
    // Pre-populate with empty content for each section if not already set
    const initialContent: {[key: string]: string} = {};
    template.sections.forEach(section => {
      if (!sectionContent[section]) {
        initialContent[section] = "";
      }
    });
    
    if (Object.keys(initialContent).length > 0) {
      setSectionContent(prev => ({ ...prev, ...initialContent }));
    }
  }, [template.sections]);

  const handleApplySuggestion = () => {
    // For demonstration, we'll add sample content to sections based on USP category
    const { toast } = useToast();
    
    // Get suggestions for all sections
    const suggestionsMap: {[key: string]: string} = {};
    
    template.sections.forEach(section => {
      let suggestionText = "";
      
      // Match suggestions to section types
      if (section.toLowerCase().includes("purpose") || section.toLowerCase().includes("scope")) {
        if (template.category === "usp797" || template.category === "sterile") {
          suggestionText = "This procedure ensures compliance with USP 797 standards for sterile compounding to minimize contamination risk and ensure patient safety.";
        } else if (template.category === "usp800" || template.category === "hazardous") {
          suggestionText = "This procedure ensures proper handling of hazardous drugs in compliance with USP 800 to protect staff, patients, and the environment from exposure risks.";
        } else if (template.category === "usp795" || template.category === "nonsterile") {
          suggestionText = "This procedure ensures consistent quality in non-sterile compounding in compliance with USP 795 standards.";
        } else {
          suggestionText = "This procedure establishes standardized practices to ensure regulatory compliance and consistent quality outcomes.";
        }
      } 
      else if (section.toLowerCase().includes("procedure") || section.toLowerCase().includes("compounding")) {
        if (template.category === "usp797" || template.category === "sterile") {
          suggestionText = "1. Perform hand hygiene using approved soap for 30 seconds minimum\n2. Don appropriate PPE in correct order (booties, hair cover, face mask, gown, gloves)\n3. Sanitize all surfaces with 70% isopropyl alcohol before beginning\n4. Maintain first air principles during all critical processes\n5. Document all compounding steps in real-time\n6. Label preparation with BUD according to USP <797> requirements";
        } else if (template.category === "usp800" || template.category === "hazardous") {
          suggestionText = "1. Don chemotherapy gloves (ASTM tested) and approved gown before handling HDs\n2. Prepare hazardous drugs only in designated negative pressure areas\n3. Use closed-system transfer devices for all liquid hazardous drugs\n4. Double-bag all waste in approved containers\n5. Follow specific decontamination protocols after each session\n6. Label with appropriate hazardous drug warnings";
        } else if (template.category === "usp795" || template.category === "nonsterile") {
          suggestionText = "1. Verify formula and calculations by second pharmacist\n2. Document lot numbers of all components\n3. Follow specific mixing procedures based on dosage form\n4. Assign beyond-use date according to stability data\n5. Complete quality verification checks before dispensing\n6. Document all compounding steps contemporaneously";
        } else {
          suggestionText = "1. Gather all required materials and documentation\n2. Follow step-by-step procedure with required checks\n3. Document all activities contemporaneously\n4. Perform quality verification before completing procedure\n5. Store completed work according to requirements";
        }
      }
      else if (section.toLowerCase().includes("ingredients")) {
        if (template.category === "sterile" || template.category === "usp797") {
          suggestionText = "List all ingredients with specific grades and sources. All ingredients must be sterile or sterilized during the compounding process. Include quantity or concentration for each component. Document lot numbers and expiration dates.";
        } else if (template.category === "hazardous" || template.category === "usp800") {
          suggestionText = "List all ingredients with specific grades and sources. Note hazardous classification (NIOSH Table 1, 2, or 3) for each hazardous component. Include quantity or concentration for each component. Document lot numbers and expiration dates.";
        } else if (template.category === "nonsterile" || template.category === "usp795") {
          suggestionText = "List all ingredients with specific grades and sources. Include quantity or concentration for each component. All ingredients must be pharmaceutical grade or USP/NF grade when available. Document lot numbers and expiration dates.";
        }
      }
      else if (section.toLowerCase().includes("equipment")) {
        if (template.category === "sterile" || template.category === "usp797") {
          suggestionText = "1. ISO Class 5 Primary Engineering Control (PEC)\n2. Personal Protective Equipment (PPE): sterile gloves, gown, mask, hair cover\n3. Sterile syringes, needles, and transfer devices\n4. Sterile containers appropriate for the preparation\n5. Sterile filters if required\n6. Verification and calibration documentation for all equipment";
        } else if (template.category === "hazardous" || template.category === "usp800") {
          suggestionText = "1. Containment Primary Engineering Control (C-PEC)\n2. Hazardous drug-rated PPE: chemotherapy gloves, gown, respirator, face shield\n3. Closed-system transfer devices (CSTDs)\n4. Hazardous drug waste containers\n5. Spill kits and containment mats\n6. Appropriate warning labels and transport containers";
        } else if (template.category === "nonsterile" || template.category === "usp795") {
          suggestionText = "1. Appropriate measuring devices (balance, graduates, pipettes)\n2. Mortar and pestle or electronic mixing devices\n3. Appropriate containers for the dosage form\n4. Appropriate compounding equipment based on dosage form\n5. Calibration and maintenance records for all equipment";
        }
      }
      else if (section.toLowerCase().includes("quality") || section.toLowerCase().includes("checks")) {
        if (template.category === "sterile" || template.category === "usp797") {
          suggestionText = "1. Visual inspection for particulates, clarity, and color\n2. Sterility testing when required per USP <797>\n3. Endotoxin testing when required\n4. Filter integrity testing when applicable\n5. Second pharmacist verification of calculations and procedure\n6. Final verification of labeling and packaging";
        } else if (template.category === "hazardous" || template.category === "usp800") {
          suggestionText = "1. Visual inspection for particulates, clarity, and color\n2. Verification of containment techniques and equipment\n3. Surface sampling as per facility schedule\n4. Second pharmacist verification of calculations and procedure\n5. Verification of appropriate hazardous drug labeling\n6. Verification of appropriate packaging for transport";
        } else {
          suggestionText = "1. Visual inspection for appropriate appearance\n2. pH verification if applicable\n3. Weight, volume, or other physical measurement verification\n4. Second pharmacist verification of calculations and procedure\n5. Final verification of labeling and packaging\n6. Documentation of all quality checks performed";
        }
      }
      else if (section.toLowerCase().includes("storage") || section.toLowerCase().includes("beyond-use")) {
        if (template.category === "sterile" || template.category === "usp797") {
          suggestionText = "Assign beyond-use date according to USP <797> Table 10 for Category 1 CSPs or Table 11 for Category 2 CSPs. Store according to component specifications and at appropriate temperature. Label with appropriate storage conditions.";
        } else if (template.category === "hazardous" || template.category === "usp800") {
          suggestionText = "Store in designated hazardous drug storage area separated from non-hazardous drugs. Use appropriate containment strategies and warning labels. Assign beyond-use date according to USP standards and stability data.";
        } else if (template.category === "nonsterile" || template.category === "usp795") {
          suggestionText = "Assign beyond-use date according to USP <795> guidelines: 14 days for water-containing oral formulations refrigerated; 30 days for water-containing topical/dermal and solid formulations at controlled room temperature; 180 days for non-aqueous formulations or when supported by valid stability data.";
        }
      }
      else if (section.toLowerCase().includes("documentation") || section.toLowerCase().includes("record")) {
        suggestionText = "All activities must be documented on approved forms. Records must be maintained for a minimum of 3 years or according to state requirements, whichever is longer. Electronic records must include audit trails. Document date, time, personnel, components, lot numbers, and quality control checks.";
      }
      else if (section.toLowerCase().includes("patient") || section.toLowerCase().includes("counseling")) {
        if (template.category === "hazardous" || template.category === "usp800") {
          suggestionText = "1. Proper administration technique and schedule\n2. Storage requirements and beyond-use date\n3. Potential side effects and monitoring requirements\n4. Special handling precautions for hazardous medications\n5. Safe disposal instructions for unused medication\n6. Documentation of patient counseling in patient record";
        } else {
          suggestionText = "1. Proper administration technique and schedule\n2. Storage requirements and beyond-use date\n3. Potential side effects and monitoring requirements\n4. Special administration instructions if applicable\n5. Documentation of patient counseling in patient record";
        }
      }
      
      // Only add suggestion if we have content and the section doesn't already have content
      if (suggestionText && (!sectionContent[section] || sectionContent[section].trim() === "")) {
        suggestionsMap[section] = suggestionText;
      }
    });
    
    // Update content with suggestions
    if (Object.keys(suggestionsMap).length > 0) {
      setSectionContent(prev => ({ ...prev, ...suggestionsMap }));
      
      toast({
        title: "AI Suggestions Applied",
        description: `Updated content for ${Object.keys(suggestionsMap).length} section(s) with USP-compliant recommendations`,
      });
    } else {
      toast({
        title: "No Suggestions Available",
        description: "All sections already have content or no relevant suggestions available",
      });
    }
    
    // Switch back to edit tab
    setActiveTab("edit");
  };

  return (
    <div className="w-full h-[600px] flex flex-col">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b">
        <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
          Customize SOP Template: {template.title}
        </p>
      </div>
      
      <div className="w-full">
        <div className="flex justify-center border-b">
          <div className="flex space-x-2 my-1">
            <button 
              onClick={() => setActiveTab("edit")} 
              className={`px-3 py-2 text-sm rounded-md transition ${activeTab === "edit" ? "bg-blue-50 dark:bg-blue-900/20 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              Edit Template
            </button>
            <button 
              onClick={() => setActiveTab("optimize")} 
              className={`px-3 py-2 text-sm rounded-md transition ${activeTab === "optimize" ? "bg-purple-50 dark:bg-purple-900/20 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              AI Optimizer
            </button>
          </div>
        </div>
        
        {activeTab === "edit" ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="title">SOP Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={templateData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sopNumber">SOP Number</Label>
                  <Input
                    id="sopNumber"
                    name="sopNumber"
                    value={templateData.sopNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy">Pharmacy Name</Label>
                  <Input
                    id="pharmacy"
                    name="pharmacy"
                    value={templateData.pharmacy}
                    onChange={handleChange}
                    placeholder="Enter your pharmacy name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input
                    id="effectiveDate"
                    name="effectiveDate"
                    type="date"
                    value={templateData.effectiveDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">USP Category</Label>
                  <select 
                    id="category"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={template.category}
                    onChange={(e) => {
                      // Update the template category
                      template.category = e.target.value;
                      // Force re-render by updating the customizing template state
                      setCustomizingTemplate({...template});
                    }}
                  >
                    {templateCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="description">Description/Purpose</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={templateData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold">Procedure Sections</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Add a new section
                    const newSectionName = prompt("Enter new section name:");
                    if (newSectionName && newSectionName.trim()) {
                      // Update the template object with new section
                      template.sections = [...template.sections, newSectionName.trim()];
                      // Initialize the content for this section
                      handleSectionChange(newSectionName.trim(), "");
                    }
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Section
                </Button>
              </div>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto p-2">
                {template.sections.map((section, index) => (
                  <div key={index} className="p-4 border rounded-md bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{index + 1}. {section}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => {
                          // Remove this section
                          const updatedSections = template.sections.filter(s => s !== section);
                          template.sections = updatedSections;
                          
                          // Remove the content for this section
                          const updatedContent = {...sectionContent};
                          delete updatedContent[section];
                          setSectionContent(updatedContent);
                          
                          // Force re-render
                          setCustomizingTemplate({...template});
                        }}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                    <Textarea
                      placeholder={`Enter detailed procedures for ${section}...`}
                      rows={4}
                      className="w-full min-h-[100px]"
                      value={sectionContent[section] || ""}
                      onChange={(e) => handleSectionChange(section, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              
              <h3 className="text-md font-semibold mb-3">Approval Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="preparedBy">Prepared By</Label>
                  <Input
                    id="preparedBy"
                    name="preparedBy"
                    value={templateData.preparedBy}
                    onChange={handleChange}
                    placeholder="Name and Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewedBy">Reviewed By</Label>
                  <Input
                    id="reviewedBy"
                    name="reviewedBy"
                    value={templateData.reviewedBy}
                    onChange={handleChange}
                    placeholder="Name and Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">Approved By</Label>
                  <Input
                    id="approvedBy"
                    name="approvedBy"
                    value={templateData.approvedBy}
                    onChange={handleChange}
                    placeholder="Name and Title"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="w-full">
              <div className="text-center py-6">
                <div className="h-12 w-12 mx-auto text-yellow-500 opacity-70 mb-3">
                  <Lightbulb className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium mb-1">Optimize Your SOP</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                  Our AI will analyze your {template.title} template and suggest improvements based on USP {template.category.replace('usp', '').toUpperCase()} guidelines and regulatory best practices.
                </p>
                <Button
                  onClick={handleApplySuggestion}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Optimization Suggestions
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end p-4 space-x-2 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="default" onClick={() => onSave(templateData.pharmacy)}>
          Save Customized SOP
        </Button>
      </div>
    </div>
  );
};

// No additional icon definition needed here

// Import the FormulaUpload and AIFormulaGenerator components
import { FormulaUpload } from "../components/sop/formula-upload";
import { AIFormulaGenerator } from "../components/sop/ai-formula-generator";

export default function SOPTemplatesPage() {
  const { toast } = useToast();
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [viewingTemplate, setViewingTemplate] = useState<SopTemplate | null>(null);
  const [customizingTemplate, setCustomizingTemplate] = useState<SopTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State to manage templates including user-uploaded ones
  const [templates, setTemplates] = useState<SopTemplate[]>(sopTemplates);
  
  // Handle the uploaded formula from FormulaUpload component
  const handleFormulaUploaded = (newFormula: SopTemplate) => {
    // Add the new formula to templates
    const updatedTemplates = [newFormula, ...templates];
    setTemplates(updatedTemplates);
    
    // Show success toast
    toast({
      title: "Formula Added",
      description: "Your compounding formula template has been added successfully.",
      variant: "default",
    });
    
    // Switch to browse tab to show the new template
    setActiveTab("all");
  };
  
  // Local function to get category icon - resolves the duplication issue
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "usp795":
        return <ClipboardList className="h-5 w-5 text-orange-500" />;
      case "usp797":
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      case "usp800":
        return <Shield className="h-5 w-5 text-red-500" />;
      case "usp825":
        return <BarChart2 className="h-5 w-5 text-purple-500" />;
      case "general":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter templates based on active tab and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeTab === "all" || template.category === activeTab;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplatePreview = (template: SopTemplate) => {
    setViewingTemplate(template);
  };

  const handleCustomizeTemplate = (template: SopTemplate) => {
    setViewingTemplate(null);
    setCustomizingTemplate(template);
  };

  const handleSaveCustomized = (pharmacy: string) => {
    if (!pharmacy) {
      toast({
        title: "Pharmacy name required",
        description: "Please enter your pharmacy name to save the customized SOP.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "SOP Customized Successfully",
      description: `The customized SOP has been saved for ${pharmacy}.`,
    });
    setCustomizingTemplate(null);
  };

  const handleDownloadTemplate = (template: SopTemplate) => {
    toast({
      title: "Template Downloaded",
      description: `${template.title} (${template.format}) has been downloaded.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">SOP Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Standardized SOP templates that can be customized for your pharmacy
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setCustomizingTemplate({ 
            id: sopTemplates.length + 1,
            title: "New SOP Template",
            description: "Enter description here",
            category: "general",
            version: "1.0",
            lastUpdated: new Date().toISOString().split('T')[0],
            format: "docx",
            sections: ["Purpose", "Scope", "Procedure", "Documentation", "Training"]
          })}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New SOP
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          {templateCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="upload">
            <Pill className="h-4 w-4 mr-1" />
            Upload Formula
          </TabsTrigger>
          <TabsTrigger value="ai-formula">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <FormulaUpload onFormulaUploaded={handleFormulaUploaded} />
          </div>
        </TabsContent>
        
        <TabsContent value="ai-formula" className="mt-0">
          <div className="max-w-3xl mx-auto">
            <AIFormulaGenerator onFormulaGenerated={handleFormulaUploaded} />
          </div>
        </TabsContent>
        
        <TabsContent value={activeTab !== "upload" ? activeTab : "all"} className="mt-0">
          {activeTab === "all" ? (
            // Group templates by category when viewing "All Templates"
            <>
              {templateCategories
                .filter(category => sopTemplates.some(template => template.category === category.id))
                .map(category => {
                  const categoryTemplates = sopTemplates.filter(t => t.category === category.id);
                  
                  if (categoryTemplates.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="mb-8">
                      <div className="flex items-center mb-4 border-b pb-2">
                        {getCategoryIcon(category.id)}
                        <h3 className="text-lg font-medium ml-2">{category.name}</h3>
                        <Badge className="ml-3">{categoryTemplates.length}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryTemplates
                          .filter(template => 
                            !searchQuery || 
                            template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            template.description.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(template => (
                            <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center">
                                    {getCategoryIcon(template.category)}
                                    <Badge variant="outline" className="ml-2">
                                      {template.category.startsWith('usp') 
                                        ? `USP ${template.category.replace('usp', '').toUpperCase()}`
                                        : template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-500">v{template.version}</div>
                                </div>
                                <CardTitle className="text-lg mt-2">{template.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {template.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="text-sm pb-2">
                                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                                  <FileText className="h-4 w-4 mr-1" />
                                  <span>{template.format.toUpperCase()} Template</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.sections.slice(0, 3).map((section, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {section}
                                    </Badge>
                                  ))}
                                  {template.sections.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{template.sections.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTemplatePreview(template)}
                                >
                                  Preview
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleCustomizeTemplate(template)}
                                >
                                  Customize
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  );
                })
              }
            </>
          ) : (
            // Standard grid view for filtered categories
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {getCategoryIcon(template.category)}
                        <Badge variant="outline" className="ml-2">
                          {template.category.startsWith('usp') 
                            ? `USP ${template.category.replace('usp', '').toUpperCase()}`
                            : template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">v{template.version}</div>
                    </div>
                    <CardTitle className="text-lg mt-2">{template.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{template.format.toUpperCase()} Template</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.sections.slice(0, 3).map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                      {template.sections.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.sections.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTemplatePreview(template)}
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleCustomizeTemplate(template)}
                    >
                      Customize
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No templates found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No SOP templates match your current search criteria.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={!!viewingTemplate} onOpenChange={(open) => !open && setViewingTemplate(null)}>
        <DialogContent className="max-w-5xl h-[80vh] max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-1">
            <DialogTitle>SOP Template Preview</DialogTitle>
            <DialogDescription>
              Template • Version {viewingTemplate?.version || "1.0"}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {viewingTemplate && (
              <TemplatePreview 
                template={viewingTemplate} 
                onClose={() => setViewingTemplate(null)}
                onCustomize={handleCustomizeTemplate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Customization Dialog */}
      <Dialog open={!!customizingTemplate} onOpenChange={(open) => !open && setCustomizingTemplate(null)}>
        <DialogContent className="max-w-5xl h-[80vh] max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-1">
            <DialogTitle>Customize SOP Template</DialogTitle>
            <DialogDescription>
              Tailor this template to your pharmacy's specific needs
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {customizingTemplate && (
              <TemplateCustomize 
                template={customizingTemplate} 
                onClose={() => setCustomizingTemplate(null)}
                onSave={handleSaveCustomized}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}