import {
  users, uspChapters, requirements, compliance, tasks, documents, training, audits, gapAnalysis, inspections, riskAssessments,
  type User, type UspChapter, type Requirement, type Compliance, type Task, type Document, type Training, type Audit, type GapAnalysis, type Inspection, type RiskAssessment,
  type InsertUser, type InsertUspChapter, type InsertRequirement, type InsertCompliance, type InsertTask, type InsertDocument, type InsertTraining, type InsertAudit, type InsertGapAnalysis, type InsertInspection, type InsertRiskAssessment
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // USP Chapters
  getUspChapters(): Promise<UspChapter[]>;
  getUspChapter(id: number): Promise<UspChapter | undefined>;
  
  // Requirements
  getRequirementsByChapter(chapterId: number): Promise<Requirement[]>;
  getRequirement(id: number): Promise<Requirement | undefined>;
  
  // Compliance
  getComplianceByRequirement(requirementId: number, pharmacyId: string): Promise<Compliance | undefined>;
  getComplianceByChapter(chapterId: number, pharmacyId: string): Promise<(Compliance & { requirement: Requirement })[]>;
  createCompliance(compliance: InsertCompliance): Promise<Compliance>;
  updateCompliance(id: number, compliance: Partial<InsertCompliance>): Promise<Compliance | undefined>;
  
  // Tasks
  getTasks(pharmacyId: string): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByStatus(status: string, pharmacyId: string): Promise<Task[]>;
  getUpcomingTasks(pharmacyId: string, limit?: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  
  // Documents
  getDocuments(pharmacyId: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  getRecentDocuments(pharmacyId: string, limit?: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Training
  getTrainingRecords(pharmacyId: string): Promise<Training[]>;
  getTrainingByUser(userId: number): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;
  
  // Audits
  getAudits(pharmacyId: string, limit?: number): Promise<Audit[]>;
  createAudit(audit: InsertAudit): Promise<Audit>;
  
  // Gap Analysis
  getGapAnalyses(pharmacyId: string): Promise<GapAnalysis[]>;
  getGapAnalysis(id: number): Promise<GapAnalysis | undefined>;
  createGapAnalysis(analysis: InsertGapAnalysis): Promise<GapAnalysis>;
  updateGapAnalysis(id: number, analysis: Partial<InsertGapAnalysis>): Promise<GapAnalysis | undefined>;
  
  // Inspections
  getInspections(pharmacyId: string): Promise<Inspection[]>;
  getInspection(id: number): Promise<Inspection | undefined>;
  createInspection(inspection: InsertInspection): Promise<Inspection>;
  updateInspection(id: number, inspection: Partial<InsertInspection>): Promise<Inspection | undefined>;
  
  // Risk Assessments
  getRiskAssessments(pharmacyId: string): Promise<RiskAssessment[]>;
  getRiskAssessment(id: number): Promise<RiskAssessment | undefined>;
  getRiskAssessmentsByChapter(usp_chapter: string, pharmacyId: string): Promise<RiskAssessment[]>;
  getCriticalRiskAssessments(pharmacyId: string, limit?: number): Promise<RiskAssessment[]>;
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  updateRiskAssessment(id: number, assessment: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined>;
  
  // Dashboard data
  getDashboardData(pharmacyId: string): Promise<{
    complianceStatus: {
      overall: number;
      byChapter: { id: number, chapter: string, percentage: number, status: string }[];
    },
    upcomingDeadlines: Task[];
    criticalIssues: (Compliance & { requirement: Requirement })[];
    recentDocuments: Document[];
    recentActivities: Audit[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private uspChapters: Map<number, UspChapter>;
  private requirements: Map<number, Requirement>;
  private compliance: Map<number, Compliance>;
  private tasks: Map<number, Task>;
  private documents: Map<number, Document>;
  private training: Map<number, Training>;
  private audits: Map<number, Audit>;
  private gapAnalyses: Map<number, GapAnalysis>;
  private inspections: Map<number, Inspection>;
  private riskAssessments: Map<number, RiskAssessment>;
  
  private userIdCounter: number;
  private uspChapterIdCounter: number;
  private requirementIdCounter: number;
  private complianceIdCounter: number;
  private taskIdCounter: number;
  private documentIdCounter: number;
  private trainingIdCounter: number;
  private auditIdCounter: number;
  private gapAnalysisIdCounter: number;
  private inspectionIdCounter: number;
  private riskAssessmentIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.uspChapters = new Map();
    this.requirements = new Map();
    this.compliance = new Map();
    this.tasks = new Map();
    this.documents = new Map();
    this.training = new Map();
    this.audits = new Map();
    this.gapAnalyses = new Map();
    this.inspections = new Map();
    this.riskAssessments = new Map();
    
    this.userIdCounter = 1;
    this.uspChapterIdCounter = 1;
    this.requirementIdCounter = 1;
    this.complianceIdCounter = 1;
    this.taskIdCounter = 1;
    this.documentIdCounter = 1;
    this.trainingIdCounter = 1;
    this.auditIdCounter = 1;
    this.gapAnalysisIdCounter = 1;
    this.inspectionIdCounter = 1;
    this.riskAssessmentIdCounter = 1;
    
    this.seedData();
  }
  
  // Seed initial data
  private seedData() {
    // Seed users
    this.createUser({
      username: "mchen",
      password: "password123",
      name: "Dr. Maria Chen",
      role: "Pharmacy Director",
      email: "mchen@example.com",
      pharmacy: "Central Pharmacy"
    });
    
    this.createUser({
      username: "jwu",
      password: "password123",
      name: "Jennifer Wu",
      role: "PharmD",
      email: "jwu@example.com",
      pharmacy: "Central Pharmacy"
    });
    
    this.createUser({
      username: "rjohnson",
      password: "password123",
      name: "Robert Johnson",
      role: "Training Coordinator",
      email: "rjohnson@example.com",
      pharmacy: "Central Pharmacy"
    });
    
    // Seed USP Chapters
    const usp795 = this.createUspChapter({
      number: "795",
      title: "Non-sterile Preparations",
      description: "Provides standards for compounding quality non-sterile preparations."
    });
    
    const usp797 = this.createUspChapter({
      number: "797",
      title: "Sterile Preparations",
      description: "Provides procedures and requirements for compounding sterile preparations."
    });
    
    const usp800 = this.createUspChapter({
      number: "800",
      title: "Hazardous Drugs",
      description: "Provides standards for handling hazardous drugs to minimize the risk of exposure."
    });
    
    // Seed requirements
    // USP 795 requirements
    const req1 = this.createRequirement({
      chapterId: usp795.id,
      section: "3.1",
      title: "Personnel Training and Evaluation",
      description: "All personnel must be trained for the compounding duties they perform.",
      criticality: "Major"
    });
    
    const req2 = this.createRequirement({
      chapterId: usp795.id,
      section: "4.2",
      title: "Temperature Monitoring",
      description: "Temperature must be monitored for medication storage areas.",
      criticality: "Critical"
    });
    
    // USP 797 requirements
    const req3 = this.createRequirement({
      chapterId: usp797.id,
      section: "5.3",
      title: "HEPA Filter Certification",
      description: "HEPA filters must be certified every 6 months.",
      criticality: "Critical"
    });
    
    const req4 = this.createRequirement({
      chapterId: usp797.id,
      section: "6.1",
      title: "Sterile Room Certification",
      description: "Sterile compounding rooms must be certified every 6 months.",
      criticality: "Critical"
    });
    
    // USP 800 requirements
    const req5 = this.createRequirement({
      chapterId: usp800.id,
      section: "7.2",
      title: "Hazardous Drug Spill Kit",
      description: "Spill kits must be readily available in all areas where HDs are handled.",
      criticality: "Critical"
    });
    
    const req6 = this.createRequirement({
      chapterId: usp800.id,
      section: "8.4",
      title: "Staff Competency Assessment",
      description: "Staff must be assessed for competency in handling hazardous drugs.",
      criticality: "Major"
    });
    
    // Seed compliance data
    this.createCompliance({
      requirementId: req1.id,
      pharmacyId: "Central Pharmacy",
      status: "Met",
      evidence: "Training records up to date",
      lastUpdated: new Date(),
      updatedBy: 1
    });
    
    this.createCompliance({
      requirementId: req2.id,
      pharmacyId: "Central Pharmacy",
      status: "Met",
      evidence: "Temperature logs verified",
      lastUpdated: new Date(),
      updatedBy: 1
    });
    
    this.createCompliance({
      requirementId: req3.id,
      pharmacyId: "Central Pharmacy",
      status: "Not Met",
      evidence: "HEPA filter certification expired",
      lastUpdated: new Date(),
      updatedBy: 2
    });
    
    this.createCompliance({
      requirementId: req4.id,
      pharmacyId: "Central Pharmacy",
      status: "In Progress",
      evidence: "Scheduled for next week",
      lastUpdated: new Date(),
      updatedBy: 2
    });
    
    this.createCompliance({
      requirementId: req5.id,
      pharmacyId: "Central Pharmacy",
      status: "Not Met",
      evidence: "Spill kit missing from satellite pharmacy",
      lastUpdated: new Date(),
      updatedBy: 3
    });
    
    this.createCompliance({
      requirementId: req6.id,
      pharmacyId: "Central Pharmacy",
      status: "In Progress",
      evidence: "Training scheduled",
      lastUpdated: new Date(),
      updatedBy: 3
    });
    
    // Seed tasks
    const now = new Date();
    
    // USP 795 Tasks (Non-sterile Preparations)
    this.createTask({
      title: "Daily Storage Conditions Verification",
      description: "Verify and log temperature and humidity levels in non-sterile compounding areas",
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      assignedTo: 2,
      status: "Pending",
      requirementId: req2.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdBy: 1,
      taskType: "Daily"
    });
    
    this.createTask({
      title: "Monthly 795 Cleaning Verification",
      description: "Complete cleaning of non-sterile compounding areas and document with checklist",
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      assignedTo: 3,
      status: "Pending",
      requirementId: req1.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdBy: 1,
      taskType: "Monthly"
    });
    
    this.createTask({
      title: "Quarterly Non-sterile Competency Assessment",
      description: "Evaluate staff competency for non-sterile compounding procedures and techniques",
      dueDate: new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
      assignedTo: 1,
      status: "Pending",
      requirementId: req1.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdBy: 1,
      taskType: "Quarterly"
    });
    
    this.createTask({
      title: "Annual Master Formulation Review",
      description: "Review and update all master formulation records for non-sterile preparations",
      dueDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      assignedTo: 1,
      status: "Pending",
      requirementId: req1.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdBy: 1,
      taskType: "Special"
    });
    
    // USP 797 Tasks (Sterile Preparations)
    this.createTask({
      title: "Daily Air Pressure Differential Monitoring",
      description: "Check and document pressure differentials between all ISO classified areas",
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      assignedTo: 2,
      status: "Pending",
      requirementId: req3.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdBy: 1,
      taskType: "Daily"
    });
    
    this.createTask({
      title: "Weekly Surface Sampling",
      description: "Collect and process surface samples from critical areas in the clean room",
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      assignedTo: 3,
      status: "Pending",
      requirementId: req3.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdBy: 1,
      taskType: "Weekly"
    });
    
    this.createTask({
      title: "Monthly HEPA Filter Testing",
      description: "Verify integrity and performance of HEPA filtration systems",
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      assignedTo: 2,
      status: "Pending",
      requirementId: req3.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdBy: 1,
      taskType: "Monthly"
    });
    
    this.createTask({
      title: "USP 797 Sterile Room Certification Renewal",
      description: "Requires external vendor inspection and documentation",
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      assignedTo: 2,
      status: "In Progress",
      requirementId: req4.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdBy: 1,
      taskType: "Special"
    });
    
    // USP 800 Tasks (Hazardous Drugs)
    this.createTask({
      title: "Daily C-PEC Pressure/Airflow Check",
      description: "Verify and document containment primary engineering control pressure and airflow readings",
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      assignedTo: 2,
      status: "Pending",
      requirementId: req5.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdBy: 1,
      taskType: "Daily"
    });
    
    this.createTask({
      title: "Weekly Hazardous Drug Spill Kit Inspection",
      description: "Check inventory and expiration dates of all spill kit components",
      dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      assignedTo: 3,
      status: "Pending",
      requirementId: req5.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdBy: 1,
      taskType: "Weekly"
    });
    
    this.createTask({
      title: "Monthly HD Containment Verification",
      description: "Conduct wipe sampling to verify containment of hazardous drugs",
      dueDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      assignedTo: 2,
      status: "Pending",
      requirementId: req5.id,
      pharmacyId: "Central Pharmacy",
      priority: "High",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdBy: 1,
      taskType: "Monthly"
    });
    
    this.createTask({
      title: "USP 800 Staff Competency Assessment",
      description: "Annual staff training on hazardous drug handling",
      dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      assignedTo: 3,
      status: "In Progress",
      requirementId: req6.id,
      pharmacyId: "Central Pharmacy",
      priority: "Medium",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdBy: 1,
      taskType: "Special"
    });
    
    this.createTask({
      title: "USP 795 SOP Review",
      description: "Quarterly review of non-sterile compounding procedures",
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      assignedTo: 1,
      status: "Open",
      requirementId: req1.id,
      pharmacyId: "Central Pharmacy",
      priority: "Low",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      createdBy: 1,
      taskType: "Quarterly"
    });
    
    // Seed documents
    this.createDocument({
      title: "USP 797 Sterile Compounding SOP",
      filename: "USP_797_Sterile_Compounding_SOP_v2.3.pdf",
      type: "SOP",
      version: "2.3",
      uploadedBy: 2,
      uploadedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      pharmacyId: "Central Pharmacy",
      chapterId: usp797.id,
      content: "Sample content for USP 797 SOP"
    });
    
    this.createDocument({
      title: "Hazardous Drug Handling Protocol",
      filename: "Hazardous_Drug_Handling_Protocol_2022.docx",
      type: "Protocol",
      version: "1.2",
      uploadedBy: 1,
      uploadedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      pharmacyId: "Central Pharmacy",
      chapterId: usp800.id,
      content: "Sample content for hazardous drug handling"
    });
    
    this.createDocument({
      title: "Quality Assurance Checklist Q2 2022",
      filename: "Quality_Assurance_Checklist_Q2_2022.xlsx",
      type: "Form",
      version: "1.0",
      uploadedBy: 3,
      uploadedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      pharmacyId: "Central Pharmacy",
      chapterId: usp795.id,
      content: "Sample content for quality assurance checklist"
    });
    
    // Seed recent activities
    this.createAudit({
      userId: 2,
      action: "Document Upload",
      details: "Uploaded new SOP for hazardous drug handling",
      timestamp: new Date(now.getTime() - 0.1 * 24 * 60 * 60 * 1000), // Today
      pharmacyId: "Central Pharmacy",
      resourceType: "Document",
      resourceId: 1
    });
    
    this.createAudit({
      userId: 3,
      action: "Compliance Update",
      details: "Completed USP 797 weekly cleaning verification",
      timestamp: new Date(now.getTime() - 0.2 * 24 * 60 * 60 * 1000), // Today
      pharmacyId: "Central Pharmacy",
      resourceType: "Compliance",
      resourceId: 3
    });
    
    this.createAudit({
      userId: null,
      action: "System Alert",
      details: "Flagged temperature excursion in refrigerator #2",
      timestamp: new Date(now.getTime() - 1.2 * 24 * 60 * 60 * 1000), // Yesterday
      pharmacyId: "Central Pharmacy",
      resourceType: "System",
      resourceId: null
    });
    
    this.createAudit({
      userId: 1,
      action: "Gap Analysis",
      details: "Started a gap analysis for USP 800 compliance",
      timestamp: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000), // Yesterday
      pharmacyId: "Central Pharmacy",
      resourceType: "GapAnalysis",
      resourceId: 1
    });
    
    // Add sample risk assessments
    this.createRiskAssessment({
      title: "Cross-contamination in non-sterile compounding",
      description: "Risk of cross-contamination between different compounds in non-sterile preparations",
      usp_chapter: "795",
      likelihood: 4,
      impact: 5,
      detection_difficulty: 3,
      current_controls: "Separate work areas for different compounds, cleaning between preparations",
      mitigation_plan: "Implement dedicated equipment for high-risk compounds, enhance cleaning protocols",
      mitigation_status: "In Progress",
      pharmacyId: "Central Pharmacy",
      owner: "Dr. Maria Chen",
      due_date: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000) // 40 days from now
    });
    
    this.createRiskAssessment({
      title: "Airflow disruption in sterile compounding area",
      description: "Risk of contamination due to inadequate airflow in sterile compounding areas",
      usp_chapter: "797",
      likelihood: 3,
      impact: 5,
      detection_difficulty: 4,
      current_controls: "Regular airflow testing, HEPA filters",
      mitigation_plan: "Install continuous airflow monitoring system with alerts",
      mitigation_status: "Not Started",
      pharmacyId: "Central Pharmacy",
      owner: "Jennifer Wu",
      due_date: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000) // 55 days from now
    });
    
    this.createRiskAssessment({
      title: "Hazardous drug exposure during preparation",
      description: "Staff exposure to hazardous drugs during preparation process",
      usp_chapter: "800",
      likelihood: 3,
      impact: 4,
      detection_difficulty: 3,
      current_controls: "PPE protocols, containment primary engineering controls",
      mitigation_plan: "Upgrade to closed-system transfer devices, enhanced staff training",
      mitigation_status: "Implemented",
      pharmacyId: "Central Pharmacy",
      owner: "Robert Johnson",
      due_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    this.createRiskAssessment({
      title: "Temperature excursion in drug storage",
      description: "Risk of temperature excursions affecting drug stability and efficacy",
      usp_chapter: "797",
      likelihood: 2,
      impact: 4,
      detection_difficulty: 2,
      current_controls: "Manual temperature logs, refrigerator alarms",
      mitigation_plan: "Implement automated temperature monitoring system with remote alerts",
      mitigation_status: "In Progress",
      pharmacyId: "Central Pharmacy",
      owner: "Dr. Maria Chen",
      due_date: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000) // 35 days from now
    });
    
    this.createRiskAssessment({
      title: "Incorrect beyond-use date assignment",
      description: "Risk of assigning incorrect beyond-use dates to compounded preparations",
      usp_chapter: "795",
      likelihood: 3,
      impact: 4,
      detection_difficulty: 4,
      current_controls: "Staff training, BUD calculation worksheets",
      mitigation_plan: "Develop computerized BUD calculator integrated with lab results",
      mitigation_status: "Not Started",
      pharmacyId: "Central Pharmacy",
      owner: "Jennifer Wu",
      due_date: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000) // 70 days from now
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // USP Chapters methods
  async getUspChapters(): Promise<UspChapter[]> {
    return Array.from(this.uspChapters.values());
  }
  
  async getUspChapter(id: number): Promise<UspChapter | undefined> {
    return this.uspChapters.get(id);
  }
  
  createUspChapter(chapter: InsertUspChapter): UspChapter {
    const id = this.uspChapterIdCounter++;
    const newChapter: UspChapter = { ...chapter, id };
    this.uspChapters.set(id, newChapter);
    return newChapter;
  }
  
  // Requirements methods
  async getRequirementsByChapter(chapterId: number): Promise<Requirement[]> {
    return Array.from(this.requirements.values()).filter(
      (req) => req.chapterId === chapterId
    );
  }
  
  async getRequirement(id: number): Promise<Requirement | undefined> {
    return this.requirements.get(id);
  }
  
  createRequirement(requirement: InsertRequirement): Requirement {
    const id = this.requirementIdCounter++;
    const newRequirement: Requirement = { ...requirement, id };
    this.requirements.set(id, newRequirement);
    return newRequirement;
  }
  
  // Compliance methods
  async getComplianceByRequirement(requirementId: number, pharmacyId: string): Promise<Compliance | undefined> {
    return Array.from(this.compliance.values()).find(
      (comp) => comp.requirementId === requirementId && comp.pharmacyId === pharmacyId
    );
  }
  
  async getComplianceByChapter(chapterId: number, pharmacyId: string): Promise<(Compliance & { requirement: Requirement })[]> {
    const requirements = await this.getRequirementsByChapter(chapterId);
    const result: (Compliance & { requirement: Requirement })[] = [];
    
    for (const req of requirements) {
      const comp = await this.getComplianceByRequirement(req.id, pharmacyId);
      if (comp) {
        result.push({ ...comp, requirement: req });
      }
    }
    
    return result;
  }
  
  async createCompliance(insertCompliance: InsertCompliance): Promise<Compliance> {
    const id = this.complianceIdCounter++;
    const compliance: Compliance = { ...insertCompliance, id };
    this.compliance.set(id, compliance);
    return compliance;
  }
  
  async updateCompliance(id: number, complianceUpdate: Partial<InsertCompliance>): Promise<Compliance | undefined> {
    const existing = this.compliance.get(id);
    if (!existing) return undefined;
    
    const updated: Compliance = { ...existing, ...complianceUpdate };
    this.compliance.set(id, updated);
    return updated;
  }
  
  // Tasks methods
  async getTasks(pharmacyId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.pharmacyId === pharmacyId
    );
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getTasksByStatus(status: string, pharmacyId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.status === status && task.pharmacyId === pharmacyId
    );
  }
  
  async getUpcomingTasks(pharmacyId: string, limit: number = 10): Promise<Task[]> {
    const now = new Date();
    return Array.from(this.tasks.values())
      .filter(task => task.pharmacyId === pharmacyId && task.dueDate && task.dueDate > now)
      .sort((a, b) => (a.dueDate as Date).getTime() - (b.dueDate as Date).getTime())
      .slice(0, limit);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    
    const updated: Task = { ...existing, ...taskUpdate };
    this.tasks.set(id, updated);
    return updated;
  }
  
  // Documents methods
  async getDocuments(pharmacyId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.pharmacyId === pharmacyId
    );
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getRecentDocuments(pharmacyId: string, limit: number = 3): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.pharmacyId === pharmacyId)
      .sort((a, b) => (b.uploadedAt as Date).getTime() - (a.uploadedAt as Date).getTime())
      .slice(0, limit);
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const document: Document = { ...insertDocument, id };
    this.documents.set(id, document);
    return document;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Training methods
  async getTrainingRecords(pharmacyId: string): Promise<Training[]> {
    return Array.from(this.training.values()).filter(
      (tr) => tr.pharmacyId === pharmacyId
    );
  }
  
  async getTrainingByUser(userId: number): Promise<Training[]> {
    return Array.from(this.training.values()).filter(
      (tr) => tr.userId === userId
    );
  }
  
  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const id = this.trainingIdCounter++;
    const training: Training = { ...insertTraining, id };
    this.training.set(id, training);
    return training;
  }
  
  // Audits methods
  async getAudits(pharmacyId: string, limit: number = 10): Promise<Audit[]> {
    return Array.from(this.audits.values())
      .filter(audit => audit.pharmacyId === pharmacyId)
      .sort((a, b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime())
      .slice(0, limit);
  }
  
  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const id = this.auditIdCounter++;
    const audit: Audit = { ...insertAudit, id };
    this.audits.set(id, audit);
    return audit;
  }
  
  // Gap Analysis methods
  async getGapAnalyses(pharmacyId: string): Promise<GapAnalysis[]> {
    return Array.from(this.gapAnalyses.values()).filter(
      (analysis) => analysis.pharmacyId === pharmacyId
    );
  }
  
  async getGapAnalysis(id: number): Promise<GapAnalysis | undefined> {
    return this.gapAnalyses.get(id);
  }
  
  async createGapAnalysis(insertAnalysis: InsertGapAnalysis): Promise<GapAnalysis> {
    const id = this.gapAnalysisIdCounter++;
    const analysis: GapAnalysis = { ...insertAnalysis, id };
    this.gapAnalyses.set(id, analysis);
    return analysis;
  }
  
  async updateGapAnalysis(id: number, analysisUpdate: Partial<InsertGapAnalysis>): Promise<GapAnalysis | undefined> {
    const existing = this.gapAnalyses.get(id);
    if (!existing) return undefined;
    
    const updated: GapAnalysis = { ...existing, ...analysisUpdate };
    this.gapAnalyses.set(id, updated);
    return updated;
  }
  
  // Inspections methods
  async getInspections(pharmacyId: string): Promise<Inspection[]> {
    return Array.from(this.inspections.values()).filter(
      (inspection) => inspection.pharmacyId === pharmacyId
    );
  }
  
  async getInspection(id: number): Promise<Inspection | undefined> {
    return this.inspections.get(id);
  }
  
  async createInspection(insertInspection: InsertInspection): Promise<Inspection> {
    const id = this.inspectionIdCounter++;
    const inspection: Inspection = { ...insertInspection, id };
    this.inspections.set(id, inspection);
    return inspection;
  }
  
  async updateInspection(id: number, inspectionUpdate: Partial<InsertInspection>): Promise<Inspection | undefined> {
    const existing = this.inspections.get(id);
    if (!existing) return undefined;
    
    const updated: Inspection = { ...existing, ...inspectionUpdate };
    this.inspections.set(id, updated);
    return updated;
  }
  
  // Risk Assessments methods
  async getRiskAssessments(pharmacyId: string): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values()).filter(
      (assessment) => assessment.pharmacyId === pharmacyId
    );
  }
  
  async getRiskAssessment(id: number): Promise<RiskAssessment | undefined> {
    return this.riskAssessments.get(id);
  }
  
  async getRiskAssessmentsByChapter(usp_chapter: string, pharmacyId: string): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values()).filter(
      (assessment) => assessment.pharmacyId === pharmacyId && assessment.usp_chapter === usp_chapter
    );
  }
  
  async getCriticalRiskAssessments(pharmacyId: string, limit: number = 5): Promise<RiskAssessment[]> {
    return Array.from(this.riskAssessments.values())
      .filter(assessment => assessment.pharmacyId === pharmacyId)
      .sort((a, b) => {
        // Sort by risk level (highest first)
        const riskLevelA = a.risk_level || (a.likelihood * a.impact);
        const riskLevelB = b.risk_level || (b.likelihood * b.impact);
        return riskLevelB - riskLevelA;
      })
      .slice(0, limit);
  }
  
  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = this.riskAssessmentIdCounter++;
    const riskAssessment: RiskAssessment = { 
      ...assessment, 
      id,
      risk_level: assessment.likelihood * assessment.impact // Calculate risk level
    };
    this.riskAssessments.set(id, riskAssessment);
    
    // Record audit log for this action
    await this.createAudit({
      action: "Risk Assessment Created",
      pharmacyId: assessment.pharmacyId,
      timestamp: new Date(),
      details: `Risk assessment "${assessment.title}" created`,
      resourceType: "risk_assessment",
      resourceId: id
    });
    
    return riskAssessment;
  }
  
  async updateRiskAssessment(id: number, assessmentUpdate: Partial<InsertRiskAssessment>): Promise<RiskAssessment | undefined> {
    const existing = this.riskAssessments.get(id);
    if (!existing) return undefined;
    
    // Recalculate risk level if likelihood or impact has changed
    let risk_level = existing.risk_level;
    if (assessmentUpdate.likelihood !== undefined || assessmentUpdate.impact !== undefined) {
      const likelihood = assessmentUpdate.likelihood || existing.likelihood;
      const impact = assessmentUpdate.impact || existing.impact;
      risk_level = likelihood * impact;
    }
    
    const updated: RiskAssessment = { 
      ...existing, 
      ...assessmentUpdate,
      risk_level
    };
    
    this.riskAssessments.set(id, updated);
    
    // Record audit log for this update
    await this.createAudit({
      action: "Risk Assessment Updated",
      pharmacyId: updated.pharmacyId,
      timestamp: new Date(),
      details: `Risk assessment "${updated.title}" updated`,
      resourceType: "risk_assessment",
      resourceId: id
    });
    
    return updated;
  }
  
  // Dashboard data
  async getDashboardData(pharmacyId: string): Promise<{
    complianceStatus: {
      overall: number;
      byChapter: { id: number, chapter: string, percentage: number, status: string }[];
    },
    upcomingDeadlines: Task[];
    criticalIssues: (Compliance & { requirement: Requirement })[];
    recentDocuments: Document[];
    recentActivities: Audit[];
  }> {
    const chapters = await this.getUspChapters();
    const chapterCompliance: { id: number, chapter: string, percentage: number, status: string }[] = [];
    let totalCompliance = 0;
    
    for (const chapter of chapters) {
      const requirements = await this.getRequirementsByChapter(chapter.id);
      if (requirements.length === 0) continue;
      
      const compliance = await this.getComplianceByChapter(chapter.id, pharmacyId);
      const metRequirements = compliance.filter(c => c.status === "Met").length;
      const percentage = Math.round((metRequirements / requirements.length) * 100);
      
      let status = "Success";
      if (percentage < 70) status = "Danger";
      else if (percentage < 80) status = "Warning";
      
      chapterCompliance.push({
        id: chapter.id,
        chapter: chapter.number,
        percentage,
        status
      });
      
      totalCompliance += percentage;
    }
    
    const overallCompliance = Math.round(totalCompliance / chapters.length);
    
    // Get critical issues
    const allCompliance = [];
    for (const chapter of chapters) {
      const chapCompliance = await this.getComplianceByChapter(chapter.id, pharmacyId);
      allCompliance.push(...chapCompliance);
    }
    
    const criticalIssues = allCompliance
      .filter(c => c.requirement.criticality === "Critical" && c.status !== "Met")
      .sort((a, b) => {
        if (a.status === "Not Met" && b.status !== "Not Met") return -1;
        if (a.status !== "Not Met" && b.status === "Not Met") return 1;
        return 0;
      });
    
    return {
      complianceStatus: {
        overall: overallCompliance,
        byChapter: chapterCompliance
      },
      upcomingDeadlines: await this.getUpcomingTasks(pharmacyId, 3),
      criticalIssues: criticalIssues.slice(0, 3),
      recentDocuments: await this.getRecentDocuments(pharmacyId),
      recentActivities: await this.getAudits(pharmacyId, 4)
    };
  }
}

export const storage = new MemStorage();
