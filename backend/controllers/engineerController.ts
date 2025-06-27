import { Request, Response } from 'express';
import { User } from '../models/User';
import { Assignment } from '../models/Assignment';

export const getEngineers = async (req: Request, res: Response) => {
  try {
    const engineers = await User.find({ role: 'engineer' }).select('-password');
    res.json(engineers);
  } catch (error) {
    console.error('Get engineers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEngineerCapacity = async (req: Request, res: Response) => {
  try {
    const engineer = await User.findById(req.params.id);
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    const activeAssignments = await Assignment.find({
      engineerId: req.params.id,
      endDate: { $gte: new Date() }
    });

    const totalAllocated = activeAssignments.reduce(
      (sum, assignment) => sum + assignment.allocationPercentage,
      0
    );

    const availableCapacity = engineer.maxCapacity - totalAllocated;

    res.json({
      engineerId: req.params.id,
      totalAllocated,
      availableCapacity,
      maxCapacity: engineer.maxCapacity,
      assignments: activeAssignments
    });
  } catch (error) {
    console.error('Get engineer capacity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};