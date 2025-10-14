import { WorkItem, IWorkItem } from "./models/WorkItem";
import { User, IUser } from "./models/User";

export interface InsertUser {
  username: string;
  password: string;
  email?: string;
  role?: 'admin' | 'user' | 'viewer';
}

export interface InsertWorkItem {
  srNo: number;
  region: string;
  district: string;
  ulbName: string;
  proposalNumber: number;
  proposalCode: string;
  applicationNumber: string;
  transactionDate: Date;
  riskBase: string;
  governmentScheme: string;
  serviceName: string;
  ownerName: string;
  siteAddress: string;
  technicalPersonName: string;
  technicalPersonCategory: string;
  pendingBy: string;
  designation: string;
  applicationReceivedDate: Date;
  days: number;
  reasons: string;
  status?: 'pending' | 'completed' | 'in-progress' | 'overdue';
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
  updateUserLastLogin(userId: string): Promise<void>;
  
  // Work Item methods
  getAllWorkItems(page?: number, limit?: number): Promise<{ data: IWorkItem[], total: number }>;
  getWorkItemById(id: string): Promise<IWorkItem | null>;
  getWorkItemByProposalNumber(proposalNumber: number): Promise<IWorkItem | null>;
  createWorkItem(item: InsertWorkItem): Promise<IWorkItem>;
  createWorkItems(items: InsertWorkItem[]): Promise<IWorkItem[]>;
  updateWorkItem(id: string, updates: Partial<InsertWorkItem>): Promise<IWorkItem | null>;
  deleteWorkItem(id: string): Promise<boolean>;
  deleteAllWorkItems(): Promise<number>;
  getWorkItemsByStatus(status: string): Promise<IWorkItem[]>;
  getWorkItemsStats(): Promise<{
    totalWorks: number;
    pendingWorks: number;
    completedWorks: number;
    inProgressWorks: number;
    overdueWorks: number;
    avgDays: number;
  }>;
}

export class MongoStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error("Error fetching user by id:", error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username, isActive: true });
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return null;
    }
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    try {
      const user = new User(insertUser);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
    } catch (error) {
      console.error("Error updating user last login:", error);
    }
  }

  // Work Item methods
  async getAllWorkItems(page: number = 1, limit: number = 50): Promise<{ data: IWorkItem[], total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        WorkItem.find()
          .sort({ applicationReceivedDate: -1 })
          .limit(limit)
          .skip(skip),
        WorkItem.countDocuments()
      ]);
      
      return { data, total };
    } catch (error) {
      console.error("Error fetching all work items:", error);
      throw error;
    }
  }

  async getWorkItemById(id: string): Promise<IWorkItem | null> {
    try {
      return await WorkItem.findById(id);
    } catch (error) {
      console.error("Error fetching work item by id:", error);
      return null;
    }
  }

  async getWorkItemByProposalNumber(proposalNumber: number): Promise<IWorkItem | null> {
    try {
      return await WorkItem.findOne({ proposalNumber });
    } catch (error) {
      console.error("Error fetching work item by proposal number:", error);
      return null;
    }
  }

  async createWorkItem(item: InsertWorkItem): Promise<IWorkItem> {
    try {
      const workItem = new WorkItem(item);
      await workItem.save();
      return workItem;
    } catch (error) {
      console.error("Error creating work item:", error);
      throw error;
    }
  }

  async createWorkItems(items: InsertWorkItem[]): Promise<IWorkItem[]> {
    try {
      return await WorkItem.insertMany(items);
    } catch (error) {
      console.error("Error creating work items:", error);
      throw error;
    }
  }

  async updateWorkItem(id: string, updates: Partial<InsertWorkItem>): Promise<IWorkItem | null> {
    try {
      return await WorkItem.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error("Error updating work item:", error);
      throw error;
    }
  }

  async deleteWorkItem(id: string): Promise<boolean> {
    try {
      const result = await WorkItem.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting work item:", error);
      return false;
    }
  }

  async deleteAllWorkItems(): Promise<number> {
    try {
      const result = await WorkItem.deleteMany({});
      return result.deletedCount || 0;
    } catch (error) {
      console.error("Error deleting all work items:", error);
      throw error;
    }
  }

  async getWorkItemsByStatus(status: string): Promise<IWorkItem[]> {
    try {
      return await WorkItem.find({ status }).sort({ applicationReceivedDate: -1 });
    } catch (error) {
      console.error("Error fetching work items by status:", error);
      throw error;
    }
  }

  async getWorkItemsStats(): Promise<{
    totalWorks: number;
    pendingWorks: number;
    completedWorks: number;
    inProgressWorks: number;
    overdueWorks: number;
    avgDays: number;
  }> {
    try {
      const [
        totalWorks,
        pendingWorks,
        completedWorks,
        inProgressWorks,
        overdueWorks,
        avgDaysResult
      ] = await Promise.all([
        WorkItem.countDocuments(),
        WorkItem.countDocuments({ status: 'pending' }),
        WorkItem.countDocuments({ status: 'completed' }),
        WorkItem.countDocuments({ status: 'in-progress' }),
        WorkItem.countDocuments({ status: 'overdue' }),
        WorkItem.aggregate([
          { $match: { status: 'pending' } },
          { $group: { _id: null, avgDays: { $avg: "$days" } } }
        ])
      ]);

      const avgDays = avgDaysResult[0]?.avgDays || 0;

      return {
        totalWorks,
        pendingWorks,
        completedWorks,
        inProgressWorks,
        overdueWorks,
        avgDays: Math.round(avgDays)
      };
    } catch (error) {
      console.error("Error fetching work items statistics:", error);
      throw error;
    }
  }
}

export const storage = new MongoStorage();