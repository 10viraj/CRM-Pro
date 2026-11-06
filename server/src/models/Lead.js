import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide lead contact person name'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true
    },
    title: {
      type: String,
      default: 'Decision Maker'
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
      default: 'new'
    },
    value: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    source: {
      type: String,
      enum: ['Website', 'LinkedIn', 'Referral', 'Google Ads', 'Email', 'Other'],
      default: 'Website'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedToName: {
      type: String,
      default: 'Viraj Somani'
    },
    notes: {
      type: String,
      default: ''
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

export const Lead = mongoose.model('Lead', LeadSchema);

