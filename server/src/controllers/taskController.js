import { Task } from '../models/Task.js';

let memoryTasks = [
  {
    id: 'task-1',
    title: 'Prepare executive proposal for Pulse Health AI',
    description: 'Review compliance checklist and calculate custom enterprise pricing model.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-11-04',
    assigneeName: 'Viraj Somani',
    relatedTo: { type: 'deal', id: 'deal-pulse', name: 'Pulse Health AI' }
  },
  {
    id: 'task-2',
    title: 'Conduct architectural demo for Nexus Cloud team',
    description: 'Demonstrate multi-region cluster failover and Kubernetes observability.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-11-04',
    assigneeName: 'Rahul Mehta',
    relatedTo: { type: 'deal', id: 'deal-nexus', name: 'Nexus Cloud Systems' }
  },
  {
    id: 'task-3',
    title: 'Sign off on Master Services Agreement with Vanguard',
    description: 'Legal review approved by counsel. Final digital signatures pending.',
    status: 'review',
    priority: 'urgent',
    dueDate: '2026-11-05',
    assigneeName: 'Alex Rivera',
    relatedTo: { type: 'deal', id: 'deal-vanguard', name: 'Vanguard FinTech' }
  },
  {
    id: 'task-4',
    title: 'Finalize SOW onboarding kickoff for Acme Technologies',
    description: 'All milestones confirmed and signed off by CTO Rohit Verma.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-11-02',
    assigneeName: 'Viraj Somani',
    relatedTo: { type: 'deal', id: 'deal-acme', name: 'Acme Technologies' }
  }
];

export const getTasks = async (req, res, next) => {
  try {
    try {
      const tasks = await Task.find().sort({ dueDate: 1 });
      if (tasks.length > 0) return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch {}

    res.status(200).json({ success: true, count: memoryTasks.length, data: memoryTasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    try {
      const task = await Task.create(req.body);
      return res.status(201).json({ success: true, data: task });
    } catch {}

    const newTask = { id: `task-${Date.now()}`, ...req.body };
    memoryTasks.unshift(newTask);
    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (task) return res.status(200).json({ success: true, data: task });
    } catch {}

    const idx = memoryTasks.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Task not found' });
    memoryTasks[idx] = { ...memoryTasks[idx], ...req.body };
    res.status(200).json({ success: true, data: memoryTasks[idx] });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Task.findByIdAndDelete(id);
    } catch {}

    memoryTasks = memoryTasks.filter(t => t.id !== id);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

