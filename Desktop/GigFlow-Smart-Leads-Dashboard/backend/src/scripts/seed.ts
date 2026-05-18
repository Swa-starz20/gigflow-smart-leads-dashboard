import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants/enums';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/gigflow';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@gigflow.com',
    password: 'Admin@12345',
    role: 'admin' as const,
  },
  {
    name: 'Sales Rep',
    email: 'sales@gigflow.com',
    password: 'Sales@12345',
    role: 'sales' as const,
  },
];

const sampleNames = [
  'Rahul Sharma',
  'Priya Patel',
  'Amit Kumar',
  'Sneha Reddy',
  'Vikram Singh',
  'Ananya Iyer',
  'Karan Mehta',
  'Divya Nair',
  'Rohan Gupta',
  'Meera Joshi',
  'Arjun Desai',
  'Kavya Rao',
  'Suresh Menon',
  'Lakshmi Pillai',
  'Nikhil Verma',
];

const seed = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  await Lead.deleteMany({});
  await User.deleteMany({});

  const users = await Promise.all(
    seedUsers.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
      return User.create({ ...u, password: hashed });
    })
  );

  const admin = users[0];
  const sales = users[1];

  const leads = sampleNames.map((name, index) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    status: LEAD_STATUSES[index % LEAD_STATUSES.length],
    source: LEAD_SOURCES[index % LEAD_SOURCES.length],
    createdBy: index % 2 === 0 ? admin._id : sales._id,
    createdAt: new Date(Date.now() - index * 86400000),
  }));

  await Lead.insertMany(leads);

  console.log('Seed completed successfully');
  console.log('Demo accounts:');
  console.log('  Admin: admin@gigflow.com / Admin@12345');
  console.log('  Sales: sales@gigflow.com / Sales@12345');

  await mongoose.disconnect();
};

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
