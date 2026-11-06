import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide task due date']
    },
    assigneeName: {
      type: String,
      default: 'Viraj Somani'
    },
    relatedTo: {
      type: {
        type: String,
        enum: ['deal', 'lead', 'contact', 'company', 'general'],
        default: 'deal'
      },
      id: String,
      name: String
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model('Task', TaskSchema);

