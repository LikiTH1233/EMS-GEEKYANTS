import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'planning' | 'active' | 'completed';

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  teamSize: number;
  status: ProjectStatus;
  managerId: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  requiredSkills: { type: [String], required: true },
  teamSize: { type: Number, required: true },
  status: { type: String, enum: ['planning', 'active', 'completed'], required: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);