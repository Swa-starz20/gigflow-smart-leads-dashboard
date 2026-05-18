import mongoose, { Schema, type Document, type Model, Types } from 'mongoose';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '../constants/enums';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
}

export interface ILeadDocument extends ILead, Document {
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
      index: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: [true, 'Source is required'],
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export const Lead: Model<ILeadDocument> =
  mongoose.models.Lead ?? mongoose.model<ILeadDocument>('Lead', leadSchema);
