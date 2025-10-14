import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import * as XLSX from "xlsx";
import { WorkItem } from "./models/WorkItem";
import { storage } from "./storage";

const upload = multer({ storage: multer.memoryStorage() });

// Improved date parser for DD-MM-YYYY format
const parseExcelDate = (serial: any) => {
  if (!serial) return new Date();
  
  // Handle Date objects
  if (serial instanceof Date) return serial;
  
  // Handle string dates (DD-MM-YYYY format from Excel)
  if (typeof serial === 'string') {
    // Try DD-MM-YYYY format (common in Excel exports)
    const parts = serial.trim().split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    
    // Fallback to ISO date parsing
    const parsed = new Date(serial);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Handle Excel serial number (numeric dates)
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date = new Date(utc_value * 1000);
    
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Fallback to current date if all parsing fails
  console.warn(`Could not parse date: ${serial}, using current date`);
  return new Date();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all work items with pagination
  app.get("/api/work-items", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await storage.getAllWorkItems(page, limit);

      res.json({
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching work items:", error);
      res.status(500).json({ error: "Failed to fetch work items" });
    }
  });

  // Get work items by status
  app.get("/api/work-items/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const items = await storage.getWorkItemsByStatus(status);
      res.json(items);
    } catch (error) {
      console.error("Error fetching work items by status:", error);
      res.status(500).json({ error: "Failed to fetch work items" });
    }
  });

  // Get single work item by ID
  app.get("/api/work-items/:id", async (req, res) => {
    try {
      const item = await storage.getWorkItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Work item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching work item:", error);
      res.status(500).json({ error: "Failed to fetch work item" });
    }
  });

  // Get dashboard statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getWorkItemsStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Upload Excel file
  app.post("/api/upload-excel", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Parse Excel file
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet, { range: 2 }); // Skip header rows

      console.log(`📄 Processing ${data.length} rows from Excel`);

      // Transform Excel data to work items
      const workItems = data.map((row: any, index: number) => {
        // Determine status based on reasons
        let status = "pending";
        const reasons = (row['Reasons'] || '').toString().toLowerCase();
        if (reasons.includes('complete')) {
          status = "completed";
        } else if (reasons.includes('progress') || reasons.includes('process')) {
          status = "in-progress";
        }

        // Helper function to get value or default
        const getValue = (value: any, defaultValue: string = 'N/A') => {
          if (value === null || value === undefined || value === '') {
            return defaultValue;
          }
          return String(value).trim() || defaultValue;
        };

        return {
          srNo: row['Sr No.'] || index + 1,
          region: getValue(row['Region']),
          district: getValue(row['District']),
          ulbName: getValue(row['ULB Name']),
          proposalNumber: parseInt(row['Proposal Number']) || 0,
          proposalCode: getValue(row['Proposal Code']),
          applicationNumber: getValue(row['Application Number'], '-'),
          transactionDate: parseExcelDate(row['Transaction Date']),
          riskBase: getValue(row['Risk Base']),
          governmentScheme: getValue(row['Government Scheme'], ''),
          serviceName: getValue(row['Service Name']),
          ownerName: getValue(row['Owner Name']),
          siteAddress: getValue(row['Site Address']),
          technicalPersonName: getValue(row['Technical Person Name']),
          technicalPersonCategory: getValue(row['Technical Person Category']),
          pendingBy: getValue(row['Pending By']),
          designation: getValue(row['Designation']),
          applicationReceivedDate: parseExcelDate(row['Application Received Date']),
          days: parseInt(row['Days']) || 0,
          reasons: getValue(row['Reasons']),
          status
        };
      });

      // Clear existing data and insert new items
      console.log('🗑️  Clearing existing data...');
      await storage.deleteAllWorkItems();
      
      console.log('💾 Inserting new data...');
      const created = await storage.createWorkItems(workItems);

      console.log(`✅ Successfully uploaded ${created.length} work items`);

      res.json({
        success: true,
        count: created.length,
        message: `Successfully uploaded ${created.length} work items`
      });
    } catch (error) {
      console.error("Error processing Excel file:", error);
      res.status(500).json({ error: "Failed to process Excel file" });
    }
  });

  // Create single work item
  app.post("/api/work-items", async (req, res) => {
    try {
      const workItem = await storage.createWorkItem(req.body);
      res.status(201).json(workItem);
    } catch (error) {
      console.error("Error creating work item:", error);
      res.status(400).json({ error: "Invalid work item data" });
    }
  });

  // Update work item
  app.put("/api/work-items/:id", async (req, res) => {
    try {
      const item = await storage.updateWorkItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Work item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating work item:", error);
      res.status(400).json({ error: "Failed to update work item" });
    }
  });

  // Delete work item
  app.delete("/api/work-items/:id", async (req, res) => {
    try {
      const success = await storage.deleteWorkItem(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Work item not found" });
      }
      res.json({ message: "Work item deleted successfully" });
    } catch (error) {
      console.error("Error deleting work item:", error);
      res.status(500).json({ error: "Failed to delete work item" });
    }
  });

  // Bulk delete all work items
  app.delete("/api/work-items", async (req, res) => {
    try {
      const deletedCount = await storage.deleteAllWorkItems();
      res.json({ 
        message: "All work items deleted successfully",
        deletedCount
      });
    } catch (error) {
      console.error("Error deleting work items:", error);
      res.status(500).json({ error: "Failed to delete work items" });
    }
  });

  // User authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await storage.updateUserLastLogin(user._id.toString());

      // Return user info (without password)
      const { password: _, ...userInfo } = user.toObject();
      res.json({
        success: true,
        user: userInfo,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Create user (for admin)
  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      const { password: _, ...userInfo } = user.toObject();
      res.status(201).json(userInfo);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Failed to create user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}