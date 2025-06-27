import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { User } from '../models/User';

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .populate('engineerId', 'name email skills maxCapacity')
      .populate('projectId', 'name status');
    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;

    // Check if engineer exists
    const engineer = await User.findById(engineerId);
    if (!engineer || engineer.role !== 'engineer') {
      return res.status(404).json({ message: 'Engineer not found' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check available capacity
    const activeAssignments = await Assignment.find({
      engineerId,
      endDate: { $gte: new Date() }
    });

    const totalAllocated = activeAssignments.reduce(
      (sum, assignment) => sum + assignment.allocationPercentage,
      0
    );

    if (totalAllocated + allocationPercentage > engineer.maxCapacity) {
      return res.status(400).json({ 
        message: 'Assignment exceeds engineer capacity',
        availableCapacity: engineer.maxCapacity - totalAllocated
      });
    }

    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { allocationPercentage, startDate, endDate, role } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check available capacity if allocation is being changed
    if (allocationPercentage && allocationPercentage !== assignment.allocationPercentage) {
      const engineer = await User.findById(assignment.engineerId);
      if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
      }

      const activeAssignments = await Assignment.find({
        engineerId: assignment.engineerId,
        endDate: { $gte: new Date() },
        _id: { $ne: assignment._id }
      });

      const totalAllocated = activeAssignments.reduce(
        (sum, a) => sum + a.allocationPercentage,
        0
      );

      if (totalAllocated + allocationPercentage > engineer.maxCapacity) {
        return res.status(400).json({ 
          message: 'Assignment exceeds engineer capacity',
          availableCapacity: engineer.maxCapacity - totalAllocated
        });
      }
    }

    assignment.allocationPercentage = allocationPercentage || assignment.allocationPercentage;
    assignment.startDate = startDate || assignment.startDate;
    assignment.endDate = endDate || assignment.endDate;
    assignment.role = role || assignment.role;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};