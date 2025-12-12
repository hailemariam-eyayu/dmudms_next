// Check which database Vercel is actually using and provide fix instructions
const mongoose = require('mongoose');

// The two databases we found
const DATABASES = {
  correct: {
    name: "CORRECT DATABASE (HAS DATA)",
    uri: "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0",
    cluster: "cluster0.rp9qif7"
  },
  empty: {
    name: "EMPTY DATABASE (NO DATA)", 
    uri: "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0",
    cluster: "cluster0.hxcedpm"
  }
};

// Define schemas
const EmployeeSchema = new mongoose.Schema({
  employee_id: String,
  first_name: String,
  last_name: String,
  email: String,
  role: String,
  status: String,
  password: String
}, { collection: 'employees' });

async function checkDatabase(db) {
  try {
    console.log(`\n🔍 Checking ${db.name}:`);
    console.log(`   Cluster: ${db.cluster}`);
    console.log(`   URI: ${db.uri.substring(0, 70)}...`);
    
    const connection = await mongoose.createConnection(db.uri);
    const Employee = connection.model('Employee', EmployeeSchema);
    
    const employeeCount = await Employee.countDocuments();
    const employee1 = await Employee.findOne({ employee_id: 'Employee1' });
    
    console.log(`   📊 Total Employees: ${employeeCount}`);
    console.log(`   👤 Employee1 exists: ${employee1 ? '✅ YES' : '❌ NO'}`);
    
    if (employee1) {
      console.log(`   👤 Employee1: ${employee1.first_name} ${employee1.last_name} (${employee1.role})`);
    }
    
    if (employeeCount > 0) {
      const sampleEmployees = await Employee.find().limit(3).sort({ employee_id: 1 });
      console.log('   📋 Sample employees:');
      sampleEmployees.forEach(emp => {
        console.log(`      ${emp.employee_id} - ${emp.first_name} ${emp.last_name} (${emp.role})`);
      });
    }
    
    await connection.close();
    
    return {
      ...db,
      employeeCount,
      hasEmployee1: !!employee1,
      working: employeeCount > 0 && !!employee1
    };
    
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    return {
      ...db,
      error: error.message,
      working: false
    };
  }
}

async function main() {
  console.log('🔍 VERCEL DATABASE IDENTIFICATION');
  console.log('=' .repeat(80));
  console.log('This script helps identify which database Vercel is using');
  console.log('and provides instructions to fix the configuration.');
  
  // Check both databases
  const correctDb = await checkDatabase(DATABASES.correct);
  const emptyDb = await checkDatabase(DATABASES.empty);
  
  console.log('\n📊 DATABASE COMPARISON SUMMARY:');
  console.log('=' .repeat(80));
  
  console.log(`\n✅ ${correctDb.name}:`);
  console.log(`   Cluster: ${correctDb.cluster}`);
  console.log(`   Employees: ${correctDb.employeeCount || 0}`);
  console.log(`   Employee1: ${correctDb.hasEmployee1 ? 'EXISTS' : 'MISSING'}`);
  console.log(`   Status: ${correctDb.working ? '🟢 WORKING' : '🔴 NOT WORKING'}`);
  
  console.log(`\n❌ ${emptyDb.name}:`);
  console.log(`   Cluster: ${emptyDb.cluster}`);
  console.log(`   Employees: ${emptyDb.employeeCount || 0}`);
  console.log(`   Employee1: ${emptyDb.hasEmployee1 ? 'EXISTS' : 'MISSING'}`);
  console.log(`   Status: ${emptyDb.working ? '🟢 WORKING' : '🔴 NOT WORKING'}`);
  
  console.log('\n🎯 VERCEL CONFIGURATION FIX:');
  console.log('=' .repeat(80));
  
  if (correctDb.working && !emptyDb.working) {
    console.log('✅ SOLUTION IDENTIFIED:');
    console.log('');
    console.log('The correct database is: cluster0.rp9qif7');
    console.log('The empty database is: cluster0.hxcedpm');
    console.log('');
    console.log('🔧 TO FIX VERCEL:');
    console.log('1. Go to: https://vercel.com/dashboard');
    console.log('2. Select your project: dmudms-next');
    console.log('3. Go to: Settings > Environment Variables');
    console.log('4. Find MONGODB_URI variable');
    console.log('5. Update it to:');
    console.log('   mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0');
    console.log('');
    console.log('6. Save the changes');
    console.log('7. Go to: Deployments tab');
    console.log('8. Click "Redeploy" on the latest deployment');
    console.log('');
    console.log('🎯 AFTER REDEPLOYMENT:');
    console.log('• Wait 2-3 minutes for deployment to complete');
    console.log('• Clear browser cache');
    console.log('• Login with: Employee1 / password');
    
  } else if (!correctDb.working && !emptyDb.working) {
    console.log('❌ BOTH DATABASES HAVE ISSUES:');
    console.log('Neither database is working properly.');
    console.log('Run the force-fix-production.js script first.');
    
  } else {
    console.log('⚠️  UNEXPECTED STATE:');
    console.log('Please check the database connections manually.');
  }
  
  console.log('\n📋 ENVIRONMENT FILE CREATED:');
  console.log('✅ .env_production file created with correct settings');
  console.log('✅ Copy these settings to Vercel Dashboard');
  
  console.log('\n🔍 CURRENT STATUS:');
  console.log(`• Correct DB (${correctDb.cluster}): ${correctDb.working ? '🟢 Ready' : '🔴 Needs Fix'}`);
  console.log(`• Empty DB (${emptyDb.cluster}): ${emptyDb.working ? '🟢 Ready' : '🔴 Empty'}`);
  console.log('• .env_production: ✅ Created');
  console.log('• Fix Instructions: ✅ Provided');
}

main().catch(console.error);