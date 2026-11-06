import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide deal opportunity title'],
      trim: true
    },
    companyName: {
      type: String,
      required: [true, 'Please provide associated company name'],
      trim: true
    },
    contactName: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      required: [true, 'Please provide deal contract value'],
      min: [0, 'Value cannot be negative']
    },
    stage: {
      type: String,
      enum: ['new_lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new_lead'
    },
    probability: {
      type: Number,
      default: 20,
      min: 0,
      max: 100
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    expectedCloseDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ownerName: {
      type: String,
      default: 'Viraj Somani'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Deal = mongoose.model('Deal', DealSchema);

