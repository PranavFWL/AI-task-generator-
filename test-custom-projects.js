// Test your AI Agent System with real project descriptions
const projectBriefs = [
  {
    name: "Healthcare Management System",
    description: "Build a comprehensive healthcare management system with patient records, appointment scheduling, doctor management, billing system, and telemedicine features",
    requirements: [
      "Patient registration and medical history",
      "Doctor and staff management",
      "Appointment scheduling with calendar integration",
      "Billing and insurance processing",
      "Telemedicine video calls",
      "Prescription management",
      "Medical reports and analytics"
    ],
    constraints: [
      "HIPAA compliance required",
      "Real-time notifications",
      "Mobile app support",
      "Data encryption and security"
    ]
  },

  {
    name: "Learning Management System",
    description: "Create an online learning platform with course management, student progress tracking, interactive assignments, and video streaming capabilities",
    requirements: [
      "Course creation and management",
      "Student enrollment and progress tracking",
      "Interactive quizzes and assignments",
      "Video streaming and live classes",
      "Discussion forums and messaging",
      "Grade book and analytics",
      "Certificate generation"
    ],
    constraints: [
      "Scalable for 10,000+ users",
      "Mobile-responsive design",
      "Integration with payment systems",
      "Multi-language support"
    ]
  },

  {
    name: "Real Estate Platform",
    description: "Develop a real estate marketplace with property listings, virtual tours, mortgage calculator, and agent communication features",
    requirements: [
      "Property listing and search",
      "Virtual tours and image galleries",
      "Mortgage and loan calculators",
      "Agent profiles and communication",
      "Favorite properties and saved searches",
      "Property comparison tools",
      "Market analytics and reports"
    ],
    constraints: [
      "Geolocation and mapping",
      "High-performance image handling",
      "SEO optimization",
      "Integration with MLS systems"
    ]
  },

  {
    name: "Food Delivery App",
    description: "Build a food delivery platform with restaurant management, order tracking, payment processing, and delivery coordination",
    requirements: [
      "Restaurant registration and menu management",
      "Customer order placement and tracking",
      "Real-time delivery tracking",
      "Payment processing and splits",
      "Driver management and routing",
      "Rating and review system",
      "Promotional codes and loyalty programs"
    ],
    constraints: [
      "Real-time GPS tracking",
      "Multiple payment methods",
      "Push notifications",
      "Performance optimization for mobile"
    ]
  },

  {
    name: "Inventory Management System",
    description: "Create an inventory management system with stock tracking, supplier management, automated reordering, and analytics dashboard",
    requirements: [
      "Product catalog and stock management",
      "Supplier and vendor management",
      "Purchase orders and receiving",
      "Automated reorder points",
      "Barcode scanning integration",
      "Inventory analytics and reports",
      "Multi-location warehouse support"
    ],
    constraints: [
      "Real-time stock updates",
      "Integration with accounting systems",
      "Barcode/QR code support",
      "Scalable for large inventories"
    ]
  }
];

console.log('🎯 Custom Project Descriptions for Testing Your AI Agent System\n');

projectBriefs.forEach((project, index) => {
  console.log(`${index + 1}. ${project.name}`);
  console.log(`   Description: ${project.description}`);
  console.log(`   Requirements: ${project.requirements.length} items`);
  console.log(`   Constraints: ${project.constraints.length} items`);
  console.log('');
});

console.log('📝 To test these with your AI system:');
console.log('   1. Copy any project description above');
console.log('   2. Modify examples/ai-powered-usage.ts');
console.log('   3. Replace the projectBrief with one from above');
console.log('   4. Run: npm run example:ai');

console.log('\n🚀 Your AI system will generate:');
console.log('   • 8-12 detailed technical tasks');
console.log('   • Time estimates for each task');
console.log('   • Risk assessment and complexity analysis');
console.log('   • Production-ready code templates');
console.log('   • Architecture recommendations');

console.log('\n💡 Try testing with increasingly complex projects to see');
console.log('   how your AI system handles different domains and requirements!');

module.exports = { projectBriefs };