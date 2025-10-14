import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkItem extends Document {
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
  status: 'pending' | 'completed' | 'in-progress' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const WorkItemSchema = new Schema<IWorkItem>({
  srNo: {
    type: Number,
    required: true,
    unique: true
  },
  region: {
    type: String,
    required: true,
    default: 'N/A'
  },
  district: {
    type: String,
    required: true,
    default: 'N/A'
  },
  ulbName: {
    type: String,
    required: true,
    default: 'N/A'
  },
  proposalNumber: {
    type: Number,
    required: true,
    unique: true
  },
  proposalCode: {
    type: String,
    required: true,
    default: 'N/A'
  },
  applicationNumber: {
    type: String,
    required: true,
    default: '-'
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  riskBase: {
    type: String,
    default: 'N/A'
  },
  governmentScheme: {
    type: String,
    default: ''
  },
  serviceName: {
    type: String,
    required: true,
    default: 'N/A'
  },
  ownerName: {
    type: String,
    required: true,
    default: 'N/A'
  },
  siteAddress: {
    type: String,
    required: true,
    default: 'N/A'
  },
  technicalPersonName: {
    type: String,
    required: true,
    default: 'N/A'
  },
  technicalPersonCategory: {
    type: String,
    required: true,
    default: 'N/A'
  },
  pendingBy: {
    type: String,
    required: true,
    default: 'N/A'
  },
  designation: {
    type: String,
    required: true,
    default: 'N/A'
  },
  applicationReceivedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  days: {
    type: Number,
    required: true,
    default: 0
  },
  reasons: {
    type: String,
    required: true,
    default: 'N/A'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'in-progress', 'overdue'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'work_items'
});

// Indexes for better performance
WorkItemSchema.index({ proposalNumber: 1 });
WorkItemSchema.index({ status: 1 });
WorkItemSchema.index({ applicationReceivedDate: -1 });
WorkItemSchema.index({ srNo: 1 });

export const WorkItem = mongoose.model<IWorkItem>('WorkItem', WorkItemSchema);