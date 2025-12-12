const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dmudms:dmudms@cluster0.hxcedpm.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

async function debugProctorNames() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('dormitory_management');
    
    console.log('=== DEBUGGING PROCTOR NAMES ISSUE ===');
    
    // Get all employees
    const employees = await db.collection('employees').find({}).toArray();
    console.log('\n1. All Employees:');
    employees.forEach(emp => {
      console.log(`  - ${emp.employee_id}: ${emp.first_name} ${emp.last_name} (${emp.role}, ${emp.status})`);
    });
    
    // Filter proctors
    const proctors = employees.filter(emp => 
      (emp.role === 'proctor' || emp.role === 'proctor_manager') && emp.status === 'active'
    );
    console.log('\n2. Active Proctors:');
    proctors.forEach(proctor => {
      console.log(`  - ${proctor.employee_id}: ${proctor.first_name} ${proctor.last_name} (${proctor.gender})`);
    });
    
    // Get blocks with proctor assignments
    const blocks = await db.collection('blocks').find({}).toArray();
    console.log('\n3. Block Assignments:');
    blocks.forEach(block => {
      console.log(`  - Block ${block.block_id}: proctor_id = "${block.proctor_id}"`);
      
      // Try to find the proctor
      const proctor = proctors.find(p => p.employee_id === block.proctor_id);
      if (proctor) {
        console.log(`    ✅ Found: ${proctor.first_name} ${proctor.last_name}`);
      } else {
        console.log(`    ❌ NOT FOUND - proctor_id "${block.proctor_id}" not in proctors list`);
        
        // Check if employee exists at all
        const employee = employees.find(e => e.employee_id === block.proctor_id);
        if (employee) {
          console.log(`    📋 Employee exists: ${employee.first_name} ${employee.last_name} (${employee.role}, ${employee.status})`);
        } else {
          console.log(`    💀 Employee does not exist at all`);
        }
      }
    });
    
    console.log('\n4. Summary:');
    console.log(`Total employees: ${employees.length}`);
    console.log(`Active proctors: ${proctors.length}`);
    console.log(`Blocks with assignments: ${blocks.filter(b => b.proctor_id).length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugProctorNames();