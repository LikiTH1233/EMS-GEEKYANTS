import mongoose, { Document } from 'mongoose';

export type UserRole = 'manager' | 'engineer';
export type SeniorityLevel = 'junior' | 'mid' | 'senior';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  skills?: string[];
  seniority?: SeniorityLevel;
  maxCapacity?: number;
  department?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'engineer'], required: true },
  skills: { type: [String], default: [] },
  seniority: { type: String, enum: ['junior', 'mid', 'senior'] },
  maxCapacity: { type: Number, default: 100 },
  department: { type: String }
});

export const User = mongoose.model<IUser>('User', UserSchema);