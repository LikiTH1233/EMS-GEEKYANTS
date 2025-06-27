import express from 'express';
import {
  authMiddleware,
  managerMiddleware,
  AuthenticatedRequest
} from '../middleware/authMiddleware';
import {
  login,
  getProfile
} from '../controllers/authController';
import {
  getEngineers,
  getEngineerCapacity
} from '../controllers/engineerController';
import {
  getProjects,
  createProject,
  getProjectById
} from '../controllers/projectController';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController';

const router = express.Router();

// Auth routes
router.post('/api/auth/login', login);
router.get('/api/auth/profile', authMiddleware, getProfile);

// Engineer routes
router.get('/api/engineers', authMiddleware, getEngineers);
router.get('/api/engineers/:id/capacity', authMiddleware, getEngineerCapacity);

// Project routes
router.get('/api/projects', authMiddleware, getProjects);
router.post('/api/projects', authMiddleware, managerMiddleware, createProject);
router.get('/api/projects/:id', authMiddleware, getProjectById);

// Assignment routes
router.get('/api/assignments', authMiddleware, getAssignments);
router.post('/api/assignments', authMiddleware, managerMiddleware, createAssignment);
router.put('/api/assignments/:id', authMiddleware, managerMiddleware, updateAssignment);
router.delete('/api/assignments/:id', authMiddleware, managerMiddleware, deleteAssignment);

export default router;