const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

async function debugProctorRequests() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('dormitory_management');
    
    console.log('=== DEBUGGING PROCTOR REQUESTS FOR EMPLOYEE8 ===');
    
    const proctorId = 'Employee8';
    
    // Step 1: Get proctor's assigned blocks
    const allBlocks = await db.collection('blocks').find({}).toArray();
    const proctorBlocks = allBlocks.filter(block => block.proctor_id === proctorId);
    
    console.log('\n1. Proctor Blocks:');
    proctorBlocks.forEach(block => {
      console.log(`  - Block ${block.block_id} (${block.name})`);
    });
    
    if (proctorBlocks.length === 0) {
      console.log('❌ No blocks assigned to Employee8');
      return;
    }
    
    // Step 2: Get students in assigned blocks
    const allPlacements = await db.collection('studentplacements').find({}).toArray();
    const assignedPlacements = allPlacements.filter(placement =>
      proctorBlocks.some(block => block.block_id === placement.block)
    );
    
    console.log('\n2. Students in Proctor Blocks:');
    assignedPlacements.forEach(placement => {
      console.log(`  - Student ${placement.student_id} in Block ${placement.block}, Room ${placement.room}`);
    });
    
    const assignedStudentIds = assignedPlacements.map(p => p.student_id);
    console.log('\n3. Assigned Student IDs:', assignedStudentIds);
    
    // Step 3: Get all requests
    const allRequests = await db.collection('requests').find({}).toArray();
    console.log('\n4. All Requests:');
    allRequests.forEach(request => {
      console.log(`  - Request ${request._id}: Student ${request.student_id}, Type: ${request.type}, Status: ${request.status}`);
    });
    
    // Step 4: Filter requests for assigned students
    const proctorRequests = allRequests.filter(request =>
      assignedStudentIds.includes(request.student_id)
    );
    
    console.log('\n5. Filtered Proctor Requests:');
    if (proctorRequests.length === 0) {
      console.log('  ❌ No requests found for assigned students');
      
      // Debug: Check if Student1 requests exist
      const student1Requests = allRequests.filter(r => r.student_id === 'Student1');
      console.log('\n6. Student1 Requests (debug):');
      student1Requests.forEach(request => {
        console.log(`  - Request ${request._id}: Type ${request.type}, Status: ${request.status}`);
        console.log(`    Student ID in request: "${request.student_id}"`);
        console.log(`    Is in assigned list: ${assignedStudentIds.includes(request.student_id)}`);
      });
      
      // Check if there's a mismatch in student ID format
      console.log('\n7. Student ID Format Check:');
      console.log('Assigned Student IDs:', assignedStudentIds);
      console.log('Request Student IDs:', [...new Set(allRequests.map(r => r.student_id))]);
      
    } else {
      proctorRequests.forEach(request => {
        console.log(`  ✅ Request ${request._id}: Student ${request.student_id}, Type: ${request.type}, Status: ${request.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugProctorRequests();