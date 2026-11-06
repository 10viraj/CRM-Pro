import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Please provide event date']
    },
    startTime: {
      type: String, // '10:00'
      required: [true, 'Please provide start time']
    },
    endTime: {
      type: String, // '11:00'
      required: [true, 'Please provide end time']
    },
    type: {
      type: String,
      enum: ['Client Meeting', 'Follow-up Call', 'Product Demo', 'Proposal Review', 'Team Meeting'],
      default: 'Client Meeting'
    },
    participants: [String],
    relatedContact: {
      type: String,
      default: ''
    },
    relatedDeal: {
      type: String,
      default: ''
    },
    meetingLink: {
      type: String,
      default: ''
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

export const Event = mongoose.model('Event', EventSchema);

