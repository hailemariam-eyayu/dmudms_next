const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

// Simulate the API logic
async function testProctorRequestsAPI() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('dormitory_management');
    
    console.log('=== TESTING PROCTOR REQUESTS API LOGIC ===');
    
    const proctorId = 'Employee8';
    
    // Get proctor's assigned blocks
    const allBlocks = await db.collection('blocks').find({}).toArray();
    const proctorBlocks = allBlocks.filter(block => 
      block.proctor_id === proctorId
    );

    if (proctorBlocks.length === 0) {
      console.log('No blocks assigned to this proctor');
      return;
    }

    // Get students placed in the proctor's assigned blocks
    const allPlacements = await db.collection('studentplacements').find({}).toArray();
    const assignedPlacements = allPlacements.filter(placement =>
      proctorBlocks.some(block => block.block_id === placement.block)
    );

    const assignedStudentIds = assignedPlacements.map(p => p.student_id);

    if (assignedStudentIds.length === 0) {
      console.log('No students assigned to your blocks');
      return;
    }

    // Get all requests and filter for assigned students only
    const allRequests = await db.collection('requests').find({}).toArray();
    const proctorRequests = allRequests.filter(request =>
      assignedStudentIds.includes(request.student_id)
    );

    // Get student details for the requests
    const students = await db.collection('students').find({}).toArray();
    const requestsWithStudentInfo = proctorRequests.map(request => {
      const student = students.find(s => s.student_id === request.student_id);
      const placement = assignedPlacements.find(p => p.student_id === request.student_id);
      
      return {
        ...request,
        student_name: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        student_email: student?.email,
        block: placement?.block,
        room: placement?.room,
        block_name: proctorBlocks.find(b => b.block_id === placement?.block)?.name
      };
    });

    // Sort by creation date (newest first)
    requestsWithStudentInfo.sort((a, b) => 
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );

    console.log('\nAPI Response would be:');
    console.log(JSON.stringify({
      success: true,
      data: requestsWithStudentInfo,
      blocks: proctorBlocks.map(block => ({
        block_id: block.block_id,
        name: block.name
      }))
    }, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testProctorRequestsAPI();