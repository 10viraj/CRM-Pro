import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide contact email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Business Contact'
    },
    stage: {
      type: String,
      enum: ['lead', 'prospect', 'customer', 'churned'],
      default: 'prospect'
    },
    ownerName: {
      type: String,
      default: 'Viraj Somani'
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Contact = mongoose.model('Contact', ContactSchema);

