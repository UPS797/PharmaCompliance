import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model with custom roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // Custom roles: compounding_specialist, compliance_officer, training_coordinator, department_supervisor, pharmacist, admin
  email: text("email"),
  pharmacy: text("pharmacy"),
  department: text("department"), // sterile, non_sterile, hazardous, quality_assurance, administration
  certifications: json("certifications"), // Array of certifications
  permissions: json("permissions"), // Custom permissions array
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

// USP Chapters
export const uspChapters = pgTable("usp_chapters", {
  id: serial("id").primaryKey(),
  number: text("number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

// Requirements for each USP chapter
export const requirements = pgTable("requirements", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
  section: text("section"),
  title: text("title").notNull(),
  description: text("description"),
  criticality: text("criticality").notNull(), // Critical, Major, Minor
});

// Compliance status for each requirement
export const compliance = pgTable("compliance", {
  id: serial("id").primaryKey(),
  requirementId: integer("requirement_id").notNull(),
  pharmacyId: text("pharmacy_id").notNull(),
  status: text("status").notNull(), // Met, Not Met, In Progress, Not Applicable
  evidence: text("evidence"),
  lastUpdated: timestamp("last_updated"),
  updatedBy: integer("updated_by"),
});

// Tasks/Checklists
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  assignedTo: integer("assigned_to"),
  status: text("status").notNull(), // Open, In Progress, Completed, Overdue
  requirementId: integer("requirement_id"),
  pharmacyId: text("pharmacy_id").notNull(),
  priority: text("priority").notNull(), // High, Medium, Low
  createdAt: timestamp("created_at"),
  createdBy: integer("created_by"),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  type: text("type").notNull(), // SOP, Policy, Form, etc.
  version: text("version"),
  uploadedBy: integer("uploaded_by"),
  uploadedAt: timestamp("uploaded_at"),
  pharmacyId: text("pharmacy_id").notNull(),
  chapterId: integer("chapter_id"),
  content: text("content"), // Document content or path
});

// Training records
export const training = pgTable("training", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
  chapterId: integer("chapter_id"),
  pharmacyId: text("pharmacy_id").notNull(),
  status: text("status").notNull(), // Completed, Pending, Expired
  verifiedBy: integer("verified_by"),
});

// Audits/Activity Logs
export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull(),
  pharmacyId: text("pharmacy_id").notNull(),
  resourceType: text("resource_type"), // User, Compliance, Document, etc.
  resourceId: integer("resource_id"),
});

// Gap Analysis
export const gapAnalysis = pgTable("gap_analysis", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  chapterId: integer("chapter_id").notNull(),
  pharmacyId: text("pharmacy_id").notNull(),
  status: text("status").notNull(), // Draft, In Progress, Completed
  findings: json("findings"),
  createdAt: timestamp("created_at"),
  createdBy: integer("created_by"),
  completedAt: timestamp("completed_at"),
});

// Inspections
export const inspections = pgTable("inspections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date"),
  pharmacyId: text("pharmacy_id").notNull(),
  status: text("status").notNull(), // Planned, Completed, Canceled
  inspectorName: text("inspector_name"),
  findings: json("findings"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at"),
});

// Risk Assessments
export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  usp_chapter: text("usp_chapter").notNull(), // 795, 797, 800
  requirementId: integer("requirement_id"),
  likelihood: integer("likelihood").notNull(),
  impact: integer("impact").notNull(),
  riskLevel: integer("risk_level").notNull(), // Calculated: likelihood × impact
  detectionDifficulty: integer("detection_difficulty").notNull(),
  currentControls: text("current_controls"),
  mitigationPlan: text("mitigation_plan").notNull(),
  mitigationStatus: text("mitigation_status").notNull(), // Not Started, In Progress, Implemented, Verified
  owner: text("owner"),
  dueDate: timestamp("due_date"),
  createdDate: timestamp("created_date").notNull(),
  updatedDate: timestamp("updated_date"),
  createdBy: integer("created_by"),
  pharmacyId: text("pharmacy_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  email: true,
  pharmacy: true,
});

export const insertUspChapterSchema = createInsertSchema(uspChapters);
export const insertRequirementSchema = createInsertSchema(requirements);
export const insertComplianceSchema = createInsertSchema(compliance);
export const insertTaskSchema = createInsertSchema(tasks);
export const insertDocumentSchema = createInsertSchema(documents);
export const insertTrainingSchema = createInsertSchema(training);
export const insertAuditSchema = createInsertSchema(audits);
export const insertGapAnalysisSchema = createInsertSchema(gapAnalysis);
export const insertInspectionSchema = createInsertSchema(inspections);
export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUspChapter = z.infer<typeof insertUspChapterSchema>;
export type InsertRequirement = z.infer<typeof insertRequirementSchema>;
export type InsertCompliance = z.infer<typeof insertComplianceSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type InsertGapAnalysis = z.infer<typeof insertGapAnalysisSchema>;
export type InsertInspection = z.infer<typeof insertInspectionSchema>;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;

export type User = typeof users.$inferSelect;
export type UspChapter = typeof uspChapters.$inferSelect;
export type Requirement = typeof requirements.$inferSelect;
export type Compliance = typeof compliance.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Training = typeof training.$inferSelect;
export type Audit = typeof audits.$inferSelect;
export type GapAnalysis = typeof gapAnalysis.$inferSelect;
export type Inspection = typeof inspections.$inferSelect;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
