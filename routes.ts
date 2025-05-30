import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import path from "path";
import express from "express";
import notionTasksRoutes from "./routes/notion-tasks-routes";
import notionAccessRoutes from "./routes/notion-list-access";
import { insertUserSchema, insertTaskSchema, insertDocumentSchema, insertComplianceSchema, insertAuditSchema, insertGapAnalysisSchema, insertInspectionSchema, insertTrainingSchema, insertRiskAssessmentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  findDatabaseByTitle, 
  getRiskAssessments, 
  createRiskAssessment,
  updateRiskAssessment,
  getTasks
} from "./notion";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve document files from the documents directory
  app.use('/documents', express.static(path.join(process.cwd(), 'public/documents')));
  
  // Use Notion tasks routes
  app.use('/api', notionTasksRoutes);
  
  // Use the Notion access routes to check which pages/databases the integration can access
  app.use('/api', notionAccessRoutes);
  
  // Error handling middleware for Zod validation errors
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Auth routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // For a real application, we would use proper auth (JWT, sessions, etc.)
      // But for this prototype, we'll just return the user
      const { password: _, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const dashboardData = await storage.getDashboardData(pharmacyId);
      return res.json(dashboardData);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // USP Chapters
  app.get("/api/chapters", async (req, res) => {
    try {
      const chapters = await storage.getUspChapters();
      return res.json(chapters);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await storage.getUspChapter(parseInt(id));
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      return res.json(chapter);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Requirements
  app.get("/api/chapters/:chapterId/requirements", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const requirements = await storage.getRequirementsByChapter(parseInt(chapterId));
      return res.json(requirements);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compliance
  app.get("/api/compliance/:pharmacyId/chapter/:chapterId", async (req, res) => {
    try {
      const { pharmacyId, chapterId } = req.params;
      const compliance = await storage.getComplianceByChapter(parseInt(chapterId), pharmacyId);
      return res.json(compliance);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/compliance", async (req, res) => {
    try {
      const complianceData = insertComplianceSchema.parse(req.body);
      const compliance = await storage.createCompliance(complianceData);
      
      // Log audit trail
      await storage.createAudit({
        userId: complianceData.updatedBy || null,
        action: "Create Compliance",
        details: `Created compliance status for requirement ${complianceData.requirementId}`,
        timestamp: new Date(),
        pharmacyId: complianceData.pharmacyId,
        resourceType: "Compliance",
        resourceId: compliance.id
      });
      
      return res.status(201).json(compliance);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.patch("/api/compliance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const complianceId = parseInt(id);
      
      // Partial validation with pick
      const validatedData = insertComplianceSchema.partial().parse(req.body);
      const updatedCompliance = await storage.updateCompliance(complianceId, validatedData);
      
      if (!updatedCompliance) {
        return res.status(404).json({ message: "Compliance record not found" });
      }
      
      // Log audit trail
      if (validatedData.updatedBy) {
        await storage.createAudit({
          userId: validatedData.updatedBy,
          action: "Update Compliance",
          details: `Updated compliance status for requirement ${updatedCompliance.requirementId}`,
          timestamp: new Date(),
          pharmacyId: updatedCompliance.pharmacyId,
          resourceType: "Compliance",
          resourceId: complianceId
        });
      }
      
      return res.json(updatedCompliance);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Tasks
  app.get("/api/tasks/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { status } = req.query;
      
      let tasks;
      if (status) {
        tasks = await storage.getTasksByStatus(status as string, pharmacyId);
      } else {
        tasks = await storage.getTasks(pharmacyId);
      }
      
      return res.json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/:pharmacyId/upcoming", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { limit } = req.query;
      
      const tasks = await storage.getUpcomingTasks(pharmacyId, limit ? parseInt(limit as string) : undefined);
      return res.json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.getTask(parseInt(id));
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      
      // Log audit trail
      await storage.createAudit({
        userId: taskData.createdBy || null,
        action: "Create Task",
        details: `Created task: ${taskData.title}`,
        timestamp: new Date(),
        pharmacyId: taskData.pharmacyId,
        resourceType: "Task",
        resourceId: task.id
      });
      
      return res.status(201).json(task);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const taskId = parseInt(id);
      
      // Partial validation
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const updatedTask = await storage.updateTask(taskId, validatedData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Log audit trail
      await storage.createAudit({
        userId: req.body.updatedBy || null,
        action: "Update Task",
        details: `Updated task: ${updatedTask.title}`,
        timestamp: new Date(),
        pharmacyId: updatedTask.pharmacyId,
        resourceType: "Task",
        resourceId: taskId
      });
      
      return res.json(updatedTask);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Documents
  app.get("/api/documents/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const documents = await storage.getDocuments(pharmacyId);
      return res.json(documents);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/documents/:pharmacyId/recent", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { limit } = req.query;
      
      const documents = await storage.getRecentDocuments(pharmacyId, limit ? parseInt(limit as string) : undefined);
      return res.json(documents);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocument(parseInt(id));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      return res.json(document);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      
      // Log audit trail
      await storage.createAudit({
        userId: documentData.uploadedBy || null,
        action: "Upload Document",
        details: `Uploaded document: ${documentData.title}`,
        timestamp: new Date(),
        pharmacyId: documentData.pharmacyId,
        resourceType: "Document",
        resourceId: document.id
      });
      
      return res.status(201).json(document);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const documentId = parseInt(id);
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const success = await storage.deleteDocument(documentId);
      
      if (success) {
        // Log audit trail
        await storage.createAudit({
          userId: req.body.userId || null,
          action: "Delete Document",
          details: `Deleted document: ${document.title}`,
          timestamp: new Date(),
          pharmacyId: document.pharmacyId,
          resourceType: "Document",
          resourceId: documentId
        });
        
        return res.status(204).send();
      } else {
        return res.status(500).json({ message: "Failed to delete document" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Training records
  app.get("/api/training/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const training = await storage.getTrainingRecords(pharmacyId);
      return res.json(training);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/training/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const training = await storage.getTrainingByUser(parseInt(userId));
      return res.json(training);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/training", async (req, res) => {
    try {
      const trainingData = insertTrainingSchema.parse(req.body);
      const training = await storage.createTraining(trainingData);
      
      // Log audit trail
      await storage.createAudit({
        userId: trainingData.verifiedBy || null,
        action: "Record Training",
        details: `Recorded training: ${trainingData.title} for user ${trainingData.userId}`,
        timestamp: new Date(),
        pharmacyId: trainingData.pharmacyId,
        resourceType: "Training",
        resourceId: training.id
      });
      
      return res.status(201).json(training);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Audit trail
  app.get("/api/audits/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { limit } = req.query;
      
      const audits = await storage.getAudits(pharmacyId, limit ? parseInt(limit as string) : undefined);
      return res.json(audits);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/audits", async (req, res) => {
    try {
      const auditData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(auditData);
      return res.status(201).json(audit);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Gap Analysis
  app.get("/api/gap-analysis/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const analyses = await storage.getGapAnalyses(pharmacyId);
      return res.json(analyses);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/gap-analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getGapAnalysis(parseInt(id));
      
      if (!analysis) {
        return res.status(404).json({ message: "Gap analysis not found" });
      }
      
      return res.json(analysis);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gap-analysis", async (req, res) => {
    try {
      const analysisData = insertGapAnalysisSchema.parse(req.body);
      const analysis = await storage.createGapAnalysis(analysisData);
      
      // Log audit trail
      await storage.createAudit({
        userId: analysisData.createdBy || null,
        action: "Create Gap Analysis",
        details: `Created gap analysis: ${analysisData.title}`,
        timestamp: new Date(),
        pharmacyId: analysisData.pharmacyId,
        resourceType: "GapAnalysis",
        resourceId: analysis.id
      });
      
      return res.status(201).json(analysis);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.patch("/api/gap-analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysisId = parseInt(id);
      
      // Partial validation
      const validatedData = insertGapAnalysisSchema.partial().parse(req.body);
      const updatedAnalysis = await storage.updateGapAnalysis(analysisId, validatedData);
      
      if (!updatedAnalysis) {
        return res.status(404).json({ message: "Gap analysis not found" });
      }
      
      // Log audit trail
      await storage.createAudit({
        userId: req.body.updatedBy || null,
        action: "Update Gap Analysis",
        details: `Updated gap analysis: ${updatedAnalysis.title}`,
        timestamp: new Date(),
        pharmacyId: updatedAnalysis.pharmacyId,
        resourceType: "GapAnalysis",
        resourceId: analysisId
      });
      
      return res.json(updatedAnalysis);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Inspections
  app.get("/api/inspections/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const inspections = await storage.getInspections(pharmacyId);
      return res.json(inspections);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/inspections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const inspection = await storage.getInspection(parseInt(id));
      
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      return res.json(inspection);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/inspections", async (req, res) => {
    try {
      const inspectionData = insertInspectionSchema.parse(req.body);
      const inspection = await storage.createInspection(inspectionData);
      
      // Log audit trail
      await storage.createAudit({
        userId: inspectionData.createdBy || null,
        action: "Create Inspection",
        details: `Created inspection: ${inspectionData.title}`,
        timestamp: new Date(),
        pharmacyId: inspectionData.pharmacyId,
        resourceType: "Inspection",
        resourceId: inspection.id
      });
      
      return res.status(201).json(inspection);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  app.patch("/api/inspections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const inspectionId = parseInt(id);
      
      // Partial validation
      const validatedData = insertInspectionSchema.partial().parse(req.body);
      const updatedInspection = await storage.updateInspection(inspectionId, validatedData);
      
      if (!updatedInspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      // Log audit trail
      await storage.createAudit({
        userId: req.body.updatedBy || null,
        action: "Update Inspection",
        details: `Updated inspection: ${updatedInspection.title}`,
        timestamp: new Date(),
        pharmacyId: updatedInspection.pharmacyId,
        resourceType: "Inspection",
        resourceId: inspectionId
      });
      
      return res.json(updatedInspection);
    } catch (err) {
      return handleZodError(err, res);
    }
  });

  // Risk Assessment routes
  app.get("/api/risk-assessments/:pharmacyId", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { chapter } = req.query;
      
      let assessments;
      if (chapter && typeof chapter === 'string') {
        assessments = await storage.getRiskAssessmentsByChapter(chapter, pharmacyId);
      } else {
        assessments = await storage.getRiskAssessments(pharmacyId);
      }
      
      return res.json(assessments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/risk-assessments/:pharmacyId/critical", async (req, res) => {
    try {
      const { pharmacyId } = req.params;
      const { limit } = req.query;
      
      const limitNum = limit ? parseInt(limit as string) : 5;
      const assessments = await storage.getCriticalRiskAssessments(pharmacyId, limitNum);
      
      return res.json(assessments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/risk-assessment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const assessmentId = parseInt(id);
      const assessment = await storage.getRiskAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      
      return res.json(assessment);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/risk-assessments", async (req, res) => {
    try {
      const assessmentData = insertRiskAssessmentSchema.parse(req.body);
      const assessment = await storage.createRiskAssessment(assessmentData);
      
      return res.status(201).json(assessment);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  
  app.patch("/api/risk-assessment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const assessmentId = parseInt(id);
      
      // Partial validation
      const validatedData = insertRiskAssessmentSchema.partial().parse(req.body);
      const updatedAssessment = await storage.updateRiskAssessment(assessmentId, validatedData);
      
      if (!updatedAssessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      
      return res.json(updatedAssessment);
    } catch (err) {
      return handleZodError(err, res);
    }
  });
  
  // Notion Risk Assessments Integration
  app.get("/api/notion/risk-assessments", async (req, res) => {
    try {
      // Find the Risk Assessments database
      const riskAssessmentsDb = await findDatabaseByTitle("Risk Assessments");
      
      if (!riskAssessmentsDb) {
        return res.status(404).json({ message: "Risk Assessments database not found in Notion" });
      }
      
      // Get risk assessments from the database
      const risks = await getRiskAssessments(riskAssessmentsDb.id);
      
      // Filter by chapter if specified
      let filteredRisks = risks;
      if (req.query.chapter && typeof req.query.chapter === 'string') {
        filteredRisks = risks.filter(risk => risk.usp_chapter === req.query.chapter);
      }
      
      // Filter by pharmacy if specified
      if (req.query.pharmacy && typeof req.query.pharmacy === 'string') {
        filteredRisks = filteredRisks.filter(risk => {
          if (risk.pharmacyId && typeof risk.pharmacyId === 'string') {
            return risk.pharmacyId.toLowerCase() === req.query.pharmacy.toLowerCase();
          }
          return false;
        });
      }
      
      res.json(filteredRisks);
    } catch (error) {
      console.error("Error getting risk assessments from Notion:", error);
      res.status(500).json({ message: "Failed to get risk assessments from Notion" });
    }
  });
  
  app.post("/api/notion/risk-assessments", async (req, res) => {
    try {
      // Validate the request body using our existing schema
      const validationResult = insertRiskAssessmentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid risk assessment data", 
          details: fromZodError(validationResult.error).message
        });
      }
      
      // Find the Risk Assessments database
      const riskAssessmentsDb = await findDatabaseByTitle("Risk Assessments");
      
      if (!riskAssessmentsDb) {
        return res.status(404).json({ message: "Risk Assessments database not found in Notion" });
      }
      
      // Format data for Notion
      const riskData = validationResult.data;
      const notionRiskData = {
        title: riskData.title,
        description: riskData.description || "",
        usp_chapter: riskData.usp_chapter,
        likelihood: riskData.likelihood,
        impact: riskData.impact,
        detection_difficulty: riskData.detectionDifficulty,
        risk_level: riskData.likelihood * riskData.impact,
        current_controls: riskData.currentControls || "",
        mitigation_plan: riskData.mitigationPlan || "",
        mitigation_status: riskData.mitigationStatus,
        owner: riskData.owner || "",
        due_date: riskData.dueDate ? new Date(riskData.dueDate).toISOString() : null,
        pharmacyId: riskData.pharmacyId
      };
      
      // Create risk assessment in Notion
      const response = await createRiskAssessment(riskAssessmentsDb.id, notionRiskData);
      
      res.status(201).json({
        message: "Risk assessment created successfully in Notion",
        notionId: response.id,
        riskData: notionRiskData
      });
    } catch (error) {
      console.error("Error creating risk assessment in Notion:", error);
      res.status(500).json({ message: "Failed to create risk assessment in Notion" });
    }
  });
  
  app.patch("/api/notion/risk-assessments/:id", async (req, res) => {
    try {
      // Validate the request body using our existing schema
      const validationResult = insertRiskAssessmentSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid risk assessment data", 
          details: fromZodError(validationResult.error).message
        });
      }
      
      const riskData = validationResult.data;
      const notionRiskData: any = {};
      
      // Only include fields that are present in the request
      if (riskData.title) notionRiskData.title = riskData.title;
      if (riskData.description !== undefined) notionRiskData.description = riskData.description || "";
      if (riskData.usp_chapter) notionRiskData.usp_chapter = riskData.usp_chapter;
      if (riskData.likelihood) notionRiskData.likelihood = riskData.likelihood;
      if (riskData.impact) notionRiskData.impact = riskData.impact;
      if (riskData.detectionDifficulty) notionRiskData.detection_difficulty = riskData.detectionDifficulty;
      
      // Calculate risk level if likelihood or impact changed
      if (riskData.likelihood || riskData.impact) {
        const currentLikelihood = riskData.likelihood || req.body.currentLikelihood || 1;
        const currentImpact = riskData.impact || req.body.currentImpact || 1;
        notionRiskData.risk_level = currentLikelihood * currentImpact;
      }
      
      if (riskData.currentControls !== undefined) notionRiskData.current_controls = riskData.currentControls || "";
      if (riskData.mitigationPlan !== undefined) notionRiskData.mitigation_plan = riskData.mitigationPlan || "";
      if (riskData.mitigationStatus) notionRiskData.mitigation_status = riskData.mitigationStatus;
      if (riskData.owner !== undefined) notionRiskData.owner = riskData.owner || "";
      if (riskData.dueDate) notionRiskData.due_date = new Date(riskData.dueDate).toISOString();
      
      // Update risk assessment in Notion
      await updateRiskAssessment(req.params.id, notionRiskData);
      
      res.json({
        message: "Risk assessment updated successfully in Notion",
        notionId: req.params.id
      });
    } catch (error) {
      console.error("Error updating risk assessment in Notion:", error);
      res.status(500).json({ message: "Failed to update risk assessment in Notion" });
    }
  });

  // Notion Tasks Integration
  app.get("/api/notion/tasks", async (req, res) => {
    try {
      // Find the Tasks database
      const tasksDb = await findDatabaseByTitle("Tasks");
      
      if (!tasksDb) {
        return res.status(404).json({ message: "Tasks database not found in Notion" });
      }
      
      // Get tasks from the database
      const tasks = await getTasks(tasksDb.id);
      
      // Filter by pharmacy if specified
      let filteredTasks = tasks;
      if (req.query.pharmacy && typeof req.query.pharmacy === 'string') {
        filteredTasks = filteredTasks.filter(task => {
          if (task.pharmacy && typeof task.pharmacy === 'string') {
            return task.pharmacy.toLowerCase() === req.query.pharmacy.toLowerCase();
          }
          return false;
        });
      }
      
      res.json(filteredTasks);
    } catch (error) {
      console.error("Error getting tasks from Notion:", error);
      res.status(500).json({ message: "Failed to get tasks from Notion" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
