/**
 * Seed Script — Creates an admin user if one doesn't exist
 * 
 * Usage:
 *   cd server
 *   node seed.js
 *
 * This will create an admin with:
 *   Email:    admin@ridenow.in
 *   Password: admin123
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  name: 'Admin',
  email: 'admin@ridenow.in',
  password: 'admin123',
  phone: '+91 99999 00000',
  role: 'admin',
};

const SEED_USERS = [
  {
    name: 'Rahul Sharma',
    email: 'driver@ridenow.in',
    password: 'driver123',
    phone: '+91 88888 11111',
    role: 'driver',
  },
  {
    name: 'Priya Patel',
    email: 'user@ridenow.in',
    password: 'user123',
    phone: '+91 77777 22222',
    role: 'user',
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  // Seed Admin
  const existingAdmin = await User.findOne({ email: ADMIN.email });
  if (existingAdmin) {
    console.log(`⚠️  Admin already exists: ${ADMIN.email}`);
  } else {
    const admin = await User.create(ADMIN);
    console.log(`✅ Admin created successfully!`);
    console.log(`   Email:    ${ADMIN.email}`);
    console.log(`   Password: ${ADMIN.password}`);
    console.log(`   Role:     ${admin.role}`);
  }

  // Seed Demo Users
  for (const userData of SEED_USERS) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`⚠️  User already exists: ${userData.email}`);
    } else {
      const user = await User.create(userData);
      console.log(`✅ User created: ${user.name} (${user.role}) — ${userData.email}`);
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Login Credentials:');
  console.log('┌─────────────────┬─────────────────────┬────────────┐');
  console.log('│ Role            │ Email               │ Password   │');
  console.log('├─────────────────┼─────────────────────┼────────────┤');
  console.log('│ Admin           │ admin@ridenow.in    │ admin123   │');
  console.log('│ Driver          │ driver@ridenow.in   │ driver123  │');
  console.log('│ User            │ user@ridenow.in     │ user123    │');
  console.log('└─────────────────┴─────────────────────┴────────────┘');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
