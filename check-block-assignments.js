const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

async function checkAssignments() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('dormitory_management');
    
    console.log('=== CHECKING BLOCK ASSIGNMENTS ===');
    
    // Check blocks and their proctor assignments
    const blocks = await db.collection('blocks').find({}).toArray();
    console.log('\nBlocks and Proctor Assignments:');
    blocks.forEach(block => {
      console.log(`Block ${block.block_id} (${block.name}): Proctor = ${block.proctor_id || 'NONE'}`);
    });
    
    // Check employees (proctors)
    const employees = await db.collection('employees').find({}).toArray();
    console.log('\nEmployees:');
    employees.forEach(emp => {
      console.log(`${emp.employee_id}: ${emp.first_name} ${emp.last_name} (${emp.role})`);
    });
    
    // Check student placements
    const placements = await db.collection('studentplacements').find({}).toArray();
    console.log('\nStudent Placements:');
    placements.forEach(placement => {
      console.log(`Student ${placement.student_id}: Block ${placement.block}, Room ${placement.room}`);
    });
    
    // Check students
    const students = await db.collection('students').find({}).toArray();
    console.log('\nStudents:');
    students.forEach(student => {
      console.log(`${student.student_id}: ${student.first_name} ${student.last_name}`);
    });
    
    // Check requests
    const requests = await db.collection('requests').find({}).toArray();
    console.log('\nRequests:');
    requests.forEach(request => {
      console.log(`Request ${request._id}: Student ${request.student_id}, Type: ${request.type}, Status: ${request.status}`);
    });
    
    console.log('\n=== SPECIFIC CHECK: Student1 and Employee8 ===');
    const student1 = students.find(s => s.student_id === 'Student1');
    const employee8 = employees.find(e => e.employee_id === 'Employee8');
    const student1Placement = placements.find(p => p.student_id === 'Student1');
    
    if (student1) {
      console.log(`Student1: ${student1.first_name} ${student1.last_name}`);
    }
    if (employee8) {
      console.log(`Employee8: ${employee8.first_name} ${employee8.last_name} (${employee8.role})`);
    }
    if (student1Placement) {
      console.log(`Student1 is placed in Block ${student1Placement.block}, Room ${student1Placement.room}`);
      
      // Check if Employee8 is assigned to that block
      const block = blocks.find(b => b.block_id === student1Placement.block);
      if (block) {
        console.log(`Block ${block.block_id} proctor: ${block.proctor_id}`);
        if (block.proctor_id === 'Employee8') {
          console.log('✅ Employee8 IS assigned to Student1\'s block');
        } else {
          console.log('❌ Employee8 is NOT assigned to Student1\'s block');
          console.log('Need to update block assignment...');
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAssignments();