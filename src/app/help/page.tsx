'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronRight,
  Users,
  Building,
  UserCheck,
  Settings,
  AlertTriangle
} from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Book,
      faqs: [
        {
          question: 'How do I log into the system?',
          answer: 'Use your employee ID or student ID as username and your assigned password. Default passwords follow the pattern: last_name + "1234abcd#"'
        },
        {
          question: 'I forgot my password, what should I do?',
          answer: 'Contact your administrator or use the password reset feature. Administrators can reset passwords from the employee/student management pages.'
        },
        {
          question: 'How do I change my password?',
          answer: 'Go to your profile page and use the "Change Password" option. You will need to enter your current password and a new password.'
        }
      ]
    },
    {
      title: 'Student Management',
      icon: Users,
      faqs: [
        {
          question: 'How do I register a new student?',
          answer: 'Navigate to Admin > Students and click "Add Student". Fill in all required information including personal details, academic information, and contact details.'
        },
        {
          question: 'How are students assigned to rooms?',
          answer: 'Students can be assigned manually through the Placements page, or automatically based on availability and gender requirements.'
        },
        {
          question: 'Can I move a student to a different room?',
          answer: 'Yes, go to the Placements page, find the student, and use the "Change Room" option to reassign them to an available room.'
        }
      ]
    },
    {
      title: 'Room & Block Management',
      icon: Building,
      faqs: [
        {
          question: 'How do I create a new block?',
          answer: 'Go to Directorate > Blocks and click "Add Block". Specify the number of floors and rooms per floor. Rooms will be automatically generated with proper numbering.'
        },
        {
          question: 'What is the default room capacity?',
          answer: 'The default room capacity is 6 students. Ground floor rooms are automatically marked as disability accessible.'
        },
        {
          question: 'How do I check room occupancy?',
          answer: 'Navigate to the specific block and view the rooms page. Each room shows current occupancy, capacity, and available spaces.'
        }
      ]
    },
    {
      title: 'Proctor Management',
      icon: UserCheck,
      faqs: [
        {
          question: 'How do I assign proctors to blocks?',
          answer: 'Use the Coordinator > Assign Proctors page or Directorate > Proctor Assignment. Proctors can only be assigned to blocks matching their gender.'
        },
        {
          question: 'What are the different employee roles?',
          answer: 'Roles include: Admin (full access), Directorate (management), Coordinator (proctor management), Proctor Manager, and Proctor (student supervision).'
        },
        {
          question: 'Can male proctors supervise female blocks?',
          answer: 'No, the system enforces gender-based assignments. Male proctors can only be assigned to male blocks, and female proctors to female blocks.'
        }
      ]
    },
    {
      title: 'System Features',
      icon: Settings,
      faqs: [
        {
          question: 'How do I generate reports?',
          answer: 'Go to Admin > Reports or Coordinator > Reports to access various system reports including student enrollment, room occupancy, and staff performance.'
        },
        {
          question: 'How do I handle emergency situations?',
          answer: 'Use the Emergency page to report and track emergency situations. Proctors can report emergencies which are visible to coordinators and administrators.'
        },
        {
          question: 'How do I manage materials and supplies?',
          answer: 'Proctors can view and request materials through the Materials page. Coordinators and administrators can manage material distribution.'
        }
      ]
    }
  ];

  const quickLinks = [
    { name: 'User Guide', href: '#user-guide', icon: Book },
    { name: 'Video Tutorials', href: '#tutorials', icon: MessageCircle },
    { name: 'Contact Support', href: '#contact', icon: Phone },
    { name: 'System Status', href: '#status', icon: AlertTriangle }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get help with using the Dormitory Management System
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center">
                <link.icon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {(searchTerm ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <category.icon className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isExpanded = expandedFaq === globalIndex;
                  
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div id="contact" className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-gray-600">support@dmudms.edu</p>
              </div>
              <div className="text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-gray-600">+251-11-XXX-XXXX</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>DMUDMS v1.0 - Dormitory Management System</p>
          <p>For technical issues, please contact your system administrator</p>
        </div>
      </div>
    </div>
  );
}