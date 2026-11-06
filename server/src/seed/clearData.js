import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { Deal } from '../models/Deal.js';
import { Contact } from '../models/Contact.js';
import { Company } from '../models/Company.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';

dotenv.config();

const clearDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_pro';

  try {
    console.log('[Clear] Connecting to MongoDB at', uri);
    await mongoose.connect(uri);
    console.log('[Clear] Connected to MongoDB.');

    await Lead.deleteMany({});
    await Deal.deleteMany({});
    await Contact.deleteMany({});
    await Company.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    // Ensure admin user exists for login
    let admin = await User.findOne({ email: 'viraj@crmpro.io' });
    if (!admin) {
      await User.create({
        name: 'Viraj Somani',
        email: 'viraj@crmpro.io',
        password: 'password123',
        role: 'admin',
        title: 'Developer / Admin',
        company: 'CRM Pro Technologies'
      });
      console.log('[Clear] Admin user ensured.');
    }

    console.log('[Clear] All CRM records (Leads, Deals, Contacts, Companies, Tasks, Activities) have been reset to ZERO.');
    await mongoose.disconnect();
    console.log('[Clear] Database disconnected cleanly.');
  } catch (error) {
    console.error('[Clear Error]', error);
    process.exit(1);
  }
};

clearDatabase();

