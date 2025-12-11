'use client';

import { FileText, Users, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600">Last updated: December 11, 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to the Dormitory Management System (DMUDMS) of Debre Markos University. These Terms of Service 
              ("Terms") govern your use of our dormitory management system and related services. By accessing or using 
              the system, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-6 w-6 mr-2" />
              Acceptance of Terms
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                By using the DMUDMS system, you acknowledge that you have read, understood, and agree to be bound by these Terms. 
                If you do not agree to these Terms, you may not access or use the system.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>These Terms apply to all users including students, employees, administrators, and staff</li>
                <li>Your continued use of the system constitutes acceptance of any updates to these Terms</li>
                <li>Additional terms may apply to specific features or services within the system</li>
              </ul>
            </div>
          </section>

          {/* User Accounts and Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              User Accounts and Responsibilities
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                <li>You must not share your account with others or allow unauthorized access</li>
                <li>You must notify the system administrator immediately of any unauthorized use</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">User Conduct</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and complete information when required</li>
                <li>Use the system only for its intended purposes</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Comply with all applicable university policies and regulations</li>
                <li>Report any system issues or security concerns promptly</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <XCircle className="h-6 w-6 mr-2" />
              Prohibited Activities
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 font-medium mb-4">The following activities are strictly prohibited:</p>
              <ul className="list-disc list-inside text-red-700 space-y-2">
                <li>Attempting to gain unauthorized access to the system or other user accounts</li>
                <li>Interfering with or disrupting the system's operation</li>
                <li>Uploading or transmitting malicious code, viruses, or harmful content</li>
                <li>Using the system for illegal activities or purposes</li>
                <li>Attempting to reverse engineer, modify, or tamper with the system</li>
                <li>Harvesting or collecting user information without authorization</li>
                <li>Impersonating other users or providing false information</li>
                <li>Using automated tools or bots to access the system</li>
              </ul>
            </div>
          </section>

          {/* System Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              System Availability and Maintenance
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We strive to maintain system availability, but cannot guarantee uninterrupted service:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The system may be temporarily unavailable for maintenance, updates, or repairs</li>
                <li>We will provide advance notice of scheduled maintenance when possible</li>
                <li>Emergency maintenance may be performed without prior notice</li>
                <li>System performance may vary based on usage and technical factors</li>
              </ul>
            </div>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data and Privacy</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Your use of the system is also governed by our Privacy Policy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We collect and process personal information as described in our Privacy Policy</li>
                <li>You consent to the collection and use of your information as outlined</li>
                <li>You are responsible for the accuracy of information you provide</li>
                <li>We implement security measures to protect your personal information</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                The DMUDMS system and its content are protected by intellectual property rights:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>The system software, design, and content are owned by Debre Markos University</li>
                <li>You may not copy, modify, distribute, or create derivative works</li>
                <li>You may use the system only as authorized under these Terms</li>
                <li>Any feedback or suggestions you provide may be used to improve the system</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Limitation of Liability
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 mb-4">
                <strong>Important:</strong> Please read this section carefully as it limits our liability.
              </p>
              <ul className="list-disc list-inside text-yellow-700 space-y-2">
                <li>The system is provided "as is" without warranties of any kind</li>
                <li>We do not guarantee the accuracy, completeness, or reliability of system information</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the extent permitted by applicable law</li>
                <li>You use the system at your own risk</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                These Terms remain in effect until terminated:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We may suspend or terminate your access for violation of these Terms</li>
                <li>Your access may be terminated upon graduation, employment termination, or other status changes</li>
                <li>You may stop using the system at any time</li>
                <li>Certain provisions of these Terms survive termination</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting to the system. Your continued use of the system after changes are posted constitutes 
              acceptance of the modified Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of Ethiopia and the policies of Debre Markos University. 
              Any disputes arising from these Terms or your use of the system will be resolved according to 
              applicable Ethiopian law and university procedures.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>System Administrator</strong></p>
                <p>Email: admin@dmu.edu</p>
                <p>Phone: +251-11-XXX-XXXX</p>
                <p>Office: IT Department</p>
                <p>Debre Markos University</p>
                <p>Debre Markos, Ethiopia</p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800">
                <strong>By using the DMUDMS system, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}