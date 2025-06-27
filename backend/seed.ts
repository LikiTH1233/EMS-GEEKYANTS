import mongoose from 'mongoose';
import { connectDB } from './database';
import { User } from './models/User';
import { Project } from './models/Project';
import { Assignment } from './models/Assignment';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});

    // Create managers
    const manager1 = await User.create({
      email: 'manager1@example.com',
      name: 'John Manager',
      password: await bcrypt.hash('password123', 10),
      role: 'manager'
    });

    const manager2 = await User.create({
      email: 'manager2@example.com',
      name: 'Jane Manager',
      password: await bcrypt.hash('password123', 10),
      role: 'manager'
    });

    // Create engineers
    const engineer1 = await User.create({
      email: 'engineer1@example.com',
      name: 'Alice Engineer',
      password: await bcrypt.hash('password123', 10),
      role: 'engineer',
      skills: ['React', 'Node.js', 'TypeScript'],
      seniority: 'senior',
      maxCapacity: 100,
      department: 'Frontend'
    });

    const engineer2 = await User.create({
      email: 'engineer2@example.com',
      name: 'Bob Engineer',
      password: await bcrypt.hash('password123', 10),
      role: 'engineer',
      skills: ['Python', 'Django', 'PostgreSQL'],
      seniority: 'mid',
      maxCapacity: 100,
      department: 'Backend'
    });

    const engineer3 = await User.create({
      email: 'engineer3@example.com',
      name: 'Charlie Engineer',
      password: await bcrypt.hash('password123', 10),
      role: 'engineer',
      skills: ['React', 'Python', 'AWS'],
      seniority: 'junior',
      maxCapacity: 50, // Part-time
      department: 'Full Stack'
    });

    // Create projects
    const project1 = await Project.create({
      name: 'E-commerce Platform',
      description: 'Build a new online store',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-03-31'),
      requiredSkills: ['React', 'Node.js', 'TypeScript'],
      teamSize: 5,
      status: 'active',
      managerId: manager1._id
    });

    const project2 = await Project.create({
      name: 'Data Analytics Dashboard',
      description: 'Create analytics for business metrics',
      startDate: new Date('2023-11-15'),
      endDate: new Date('2024-02-28'),
      requiredSkills: ['Python', 'Django', 'PostgreSQL'],
      teamSize: 3,
      status: 'active',
      managerId: manager2._id
    });

    const project3 = await Project.create({
      name: 'Mobile App Redesign',
      description: 'Redesign the existing mobile application',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      requiredSkills: ['React', 'AWS'],
      teamSize: 4,
      status: 'planning',
      managerId: manager1._id
    });

    // Create assignments
    await Assignment.create({
      engineerId: engineer1._id,
      projectId: project1._id,
      allocationPercentage: 60,
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-03-31'),
      role: 'Frontend Lead'
    });

    await Assignment.create({
      engineerId: engineer2._id,
      projectId: project2._id,
      allocationPercentage: 80,
      startDate: new Date('2023-11-15'),
      endDate: new Date('2024-02-28'),
      role: 'Backend Developer'
    });

    await Assignment.create({
      engineerId: engineer3._id,
      projectId: project1._id,
      allocationPercentage: 30,
      startDate: new Date('2023-10-15'),
      endDate: new Date('2024-01-31'),
      role: 'Frontend Developer'
    });

    await Assignment.create({
      engineerId: engineer3._id,
      projectId: project3._id,
      allocationPercentage: 20,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      role: 'UI Developer'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();