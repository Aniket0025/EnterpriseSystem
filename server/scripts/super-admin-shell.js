// MongoDB Shell Scripts for HR Portal Super Admin Operations
// Usage: node scripts/super-admin-shell.js [command] [options]

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hr_portal';
const DB_NAME = 'hr_portal';

async function connectToDB() {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

async function disconnectFromDB(client) {
  try {
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Disconnect error:', error.message);
  }
}

async function createSuperAdmin(email, password, fullName) {
  const { client, db } = await connectToDB();
  try {
    const users = db.collection('users');
    
    // Check if super admin already exists
    const existingSuperAdmin = await users.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('⚠️ Super admin already exists');
      return;
    }
    
    // Check if email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log('⚠️ Email already exists:', email);
      return;
    }
    
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await users.insertOne({
      full_name: fullName,
      email: email,
      password: hashedPassword,
      role: 'super_admin',
      status: 'active',
      createdAt: new Date()
    });
    
    console.log('✅ Super admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', fullName);
    console.log('🆔 ID:', result.insertedId);
    
    await disconnectFromDB(client);
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    await disconnectFromDB(client);
    process.exit(1);
  }
}

// Command: list-super-admins
async function listSuperAdmins() {
  const { client, db } = await connectToDB();
  try {
    const users = db.collection('users');
    const superAdmins = await users.find({ role: 'super_admin' }).toArray();
    
    console.log('📋 Super Admins:');
    superAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.full_name} (${admin.email}) - ${admin.status}`);
    });
    
    await disconnectFromDB(client);
  } catch (error) {
    console.error('❌ Error listing super admins:', error);
    await disconnectFromDB(client);
    process.exit(1);
  }
}

// Command: update-user-role
async function updateUserRole(userId, newRole) {
  const { client, db } = await connectToDB();
  try {
    const users = db.collection('users');
    const { ObjectId } = require('mongodb').ObjectId;
    
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole, updatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ User role updated to ${newRole}`);
    } else {
      console.log('⚠️ User not found or no changes made');
    }
    
    await disconnectFromDB(client);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    await disconnectFromDB(client);
    process.exit(1);
  }
}

// Command: reset-user-password
async function resetUserPassword(email, newPassword) {
  const { client, db } = await connectToDB();
  try {
    const users = db.collection('users');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await users.updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Password reset for ${email}`);
    } else {
      console.log('⚠️ User not found');
    }
    
    await disconnectFromDB(client);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    await disconnectFromDB(client);
    process.exit(1);
  }
}

// Command: get-user-stats
async function getUserStats() {
  const { client, db } = await connectToDB();
  try {
    const users = db.collection('users');
    const stats = await users.aggregate([
      { $group: { _id: null, role: '$role' }, count: { $sum: 1 } },
      { $group: { _id: null, status: '$status' }, count: { $sum: 1 } }
    ]);
    
    console.log('📊 User Statistics:');
    console.log(`Total Users: ${stats[0]?.total || 0}`);
    console.log('By Role:');
    stats[1]?.forEach(roleGroup => {
      console.log(`  ${roleGroup._id}: ${roleGroup.count} users`);
    });
    console.log('By Status:');
    stats[2]?.forEach(statusGroup => {
      console.log(`  ${statusGroup._id}: ${statusGroup.count} users`);
    });
    
    await disconnectFromDB(client);
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    await disconnectFromDB(client);
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'create-super-admin':
    if (args.length < 4) {
      console.log('❌ Usage: node scripts/super-admin-shell.js create-super-admin <email> <password> <full-name>');
      process.exit(1);
    }
    await createSuperAdmin(args[0], args[1], args[2]);
    break;
    
  case 'list-super-admins':
    await listSuperAdmins();
    break;
    
  case 'update-user-role':
    if (args.length < 3) {
      console.log('❌ Usage: node scripts/super-admin-shell.js update-user-role <userId> <new-role>');
      process.exit(1);
    }
    await updateUserRole(args[0], args[1]);
    break;
    
  case 'reset-user-password':
    if (args.length < 3) {
      console.log('❌ Usage: node scripts/super-admin-shell.js reset-user-password <email> <new-password>');
      process.exit(1);
    }
    await resetUserPassword(args[0], args[1]);
    break;
    
  case 'get-user-stats':
    await getUserStats();
    break;
    
  default:
    console.log('❌ Unknown command:', command);
    console.log('');
    console.log('Available commands:');
    console.log('  create-super-admin <email> <password> <full-name>');
    console.log('  list-super-admins');
    console.log('  update-user-role <userId> <new-role>');
    console.log('  reset-user-password <email> <new-password>');
    console.log('  get-user-stats');
    process.exit(1);
}
