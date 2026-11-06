import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'note', 'task', 'deal_update'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    contactName: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    dealTitle: {
      type: String,
      default: ''
    },
    performedBy: {
      type: String,
      default: 'Viraj Somani'
    },
    completed: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Activity = mongoose.model('Activity', ActivitySchema);

