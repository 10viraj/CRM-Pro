import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      unique: true
    },
    industry: {
      type: String,
      default: 'Information Technology'
    },
    employees: {
      type: String,
      default: '50-200'
    },
    annualRevenue: {
      type: String,
      default: '₹10,00,000+'
    },
    website: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Mumbai, India'
    },
    status: {
      type: String,
      enum: ['Active Customer', 'Prospect', 'Partner', 'Churned'],
      default: 'Prospect'
    },
    ownerName: {
      type: String,
      default: 'Viraj Somani'
    }
  },
  {
    timestamps: true
  }
);

export const Company = mongoose.model('Company', CompanySchema);

