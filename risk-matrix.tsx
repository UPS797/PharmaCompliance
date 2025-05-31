import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskItem {
  id: number;
  title: string;
  description: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  chapter: string; // e.g., "795", "797", "800"
  requirement: string;
  mitigationStatus: "Not Started" | "In Progress" | "Implemented" | "Verified";
}

interface RiskMatrixProps {
  risks: RiskItem[];
  onRiskClick?: (risk: RiskItem) => void;
}

export function RiskMatrix({ risks, onRiskClick }: RiskMatrixProps) {
  // Matrix is 5x5: Likelihood (y-axis, 5 at top) x Impact (x-axis, 5 at right)
  const matrixSize = 5;
  
  // Populate the matrix with risks
  const getMatrixCell = (likelihood: number, impact: number) => {
    return risks.filter(risk => risk.likelihood === likelihood && risk.impact === impact);
  };
  
  // Get cell color based on risk level (likelihood × impact)
  const getCellColor = (likelihood: number, impact: number) => {
    const riskScore = likelihood * impact;
    
    if (riskScore >= 15) {
      return "bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500 border-danger-200 dark:border-danger-800";
    } else if (riskScore >= 8) {
      return "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500 border-warning-200 dark:border-warning-800";
    } else if (riskScore >= 3) {
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800";
    } else {
      return "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500 border-success-200 dark:border-success-800";
    }
  };
  
  const getLikelihoodLabel = (value: number) => {
    switch (value) {
      case 5: return "Very High";
      case 4: return "High";
      case 3: return "Medium";
      case 2: return "Low";
      case 1: return "Very Low";
      default: return "";
    }
  };
  
  const getImpactLabel = (value: number) => {
    switch (value) {
      case 5: return "Critical";
      case 4: return "Major";
      case 3: return "Moderate";
      case 2: return "Minor";
      case 1: return "Negligible";
      default: return "";
    }
  };
  
  // Get total risk count by category
  const criticalRisks = risks.filter(risk => risk.likelihood * risk.impact >= 15).length;
  const highRisks = risks.filter(risk => risk.likelihood * risk.impact >= 8 && risk.likelihood * risk.impact < 15).length;
  const moderateRisks = risks.filter(risk => risk.likelihood * risk.impact >= 3 && risk.likelihood * risk.impact < 8).length;
  const lowRisks = risks.filter(risk => risk.likelihood * risk.impact < 3).length;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Risk Assessment Matrix</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500">
              Critical: {criticalRisks}
            </Badge>
            <Badge variant="outline" className="bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500">
              High: {highRisks}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500">
              Moderate: {moderateRisks}
            </Badge>
            <Badge variant="outline" className="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500">
              Low: {lowRisks}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2 overflow-x-auto">
          <div className="flex">
            <div className="w-24 flex-shrink-0">
              <div className="h-10"></div>
              <div className="h-36 flex items-center justify-center">
                <div className="transform -rotate-90 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Likelihood
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="h-10 flex items-center justify-center">
                <div className="font-medium text-gray-700 dark:text-gray-300">Impact</div>
              </div>
              
              <div className="flex">
                <div className="w-14 flex-shrink-0">
                  {Array.from({ length: matrixSize }).map((_, rowIdx) => {
                    const likelihoodValue = matrixSize - rowIdx;
                    return (
                      <div key={`row-${rowIdx}`} className="h-24 flex items-center justify-end pr-2 font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col items-end">
                          <div>{likelihoodValue}</div>
                          <div className="text-xs">{getLikelihoodLabel(likelihoodValue)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {Array.from({ length: matrixSize }).map((_, rowIdx) => {
                    const likelihoodValue = matrixSize - rowIdx;
                    
                    return Array.from({ length: matrixSize }).map((_, colIdx) => {
                      const impactValue = colIdx + 1;
                      const cellRisks = getMatrixCell(likelihoodValue, impactValue);
                      
                      return (
                        <div 
                          key={`cell-${rowIdx}-${colIdx}`} 
                          className={`h-24 flex items-center justify-center border rounded ${getCellColor(likelihoodValue, impactValue)}`}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="w-full h-full flex flex-col items-center justify-center p-1">
                                <div className="text-xl font-bold">
                                  {cellRisks.length > 0 ? cellRisks.length : "-"}
                                </div>
                                <div className="text-xs">
                                  {likelihoodValue * impactValue}
                                </div>
                              </TooltipTrigger>
                              {cellRisks.length > 0 && (
                                <TooltipContent className="max-w-md">
                                  <div>
                                    <strong>Risk Level:</strong> {likelihoodValue * impactValue} 
                                    (Likelihood {likelihoodValue} × Impact {impactValue})
                                  </div>
                                  <div className="mt-2">
                                    <strong>Risks in this category:</strong>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                      {cellRisks.map((risk) => (
                                        <li 
                                          key={risk.id} 
                                          className="cursor-pointer hover:underline"
                                          onClick={() => onRiskClick && onRiskClick(risk)}
                                        >
                                          {risk.title}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
              
              <div className="mt-1 flex justify-around px-14">
                {Array.from({ length: matrixSize }).map((_, idx) => {
                  const impactValue = idx + 1;
                  return (
                    <div key={`impact-${idx}`} className="flex flex-col items-center">
                      <div className="font-medium text-gray-700 dark:text-gray-300">{impactValue}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{getImpactLabel(impactValue)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="border rounded p-2 bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-500 border-danger-200 dark:border-danger-800">
              <div className="font-medium">Critical Risk (15-25)</div>
              <div className="text-xs mt-1">Immediate action required. Strict mitigation essential.</div>
            </div>
            <div className="border rounded p-2 bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-500 border-warning-200 dark:border-warning-800">
              <div className="font-medium">High Risk (8-14)</div>
              <div className="text-xs mt-1">Prompt action needed. Senior management attention required.</div>
            </div>
            <div className="border rounded p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800">
              <div className="font-medium">Moderate Risk (3-7)</div>
              <div className="text-xs mt-1">Specific monitoring needed. Responsibilities must be specified.</div>
            </div>
            <div className="border rounded p-2 bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-500 border-success-200 dark:border-success-800">
              <div className="font-medium">Low Risk (1-2)</div>
              <div className="text-xs mt-1">Routine procedures sufficient. Periodic monitoring required.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}