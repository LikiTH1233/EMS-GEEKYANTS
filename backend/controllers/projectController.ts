import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate('managerId', 'name email');
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, requiredSkills, teamSize, status } = req.body;
    
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status,
      managerId: req.user.id
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('managerId', 'name email')
      .populate({
        path: 'assignments',
        populate: { path: 'engineerId', select: 'name email skills' }
      });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};