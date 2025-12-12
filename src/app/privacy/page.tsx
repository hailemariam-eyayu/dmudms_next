'use client';

import { Shield, Eye, Lock, Database, Users, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: December 11, 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              The Dormitory Management System (DMUDMS) is committed to protecting the privacy and security of 
              personal information collected from students, employees, and other users of our system. This Privacy 
              Policy explains how we collect, use, store, and protect your personal information.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Student Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Personal details (name, student ID, email, phone number)</li>
                  <li>Academic information (batch, department, program)</li>
                  <li>Emergency contact information (parent/guardian details)</li>
                  <li>Accommodation preferences and disability status</li>
                  <li>Room assignment and placement history</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Personal details (name, employee ID, email, phone number)</li>
                  <li>Job role and department information</li>
                  <li>Work assignments and responsibilities</li>
                  <li>System access logs and activity records</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">System Usage Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Login timestamps and session information</li>
                  <li>System interactions and feature usage</li>
                  <li>Request and complaint submissions</li>
                  <li>Material and resource allocation records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2" />
              How We Use Your Information
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Accommodation Management:</strong> Assigning rooms, managing placements, and ensuring appropriate housing arrangements</li>
                <li><strong>Emergency Response:</strong> Contacting emergency contacts when necessary and ensuring student safety</li>
                <li><strong>Administrative Operations:</strong> Managing student records, processing requests, and maintaining system functionality</li>
                <li><strong>Communication:</strong> Sending important notifications, updates, and system-related communications</li>
                <li><strong>Reporting and Analytics:</strong> Generating reports for administrative purposes and system improvement</li>
                <li><strong>Security and Compliance:</strong> Maintaining system security and complying with institutional policies</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2" />
              Data Security and Protection
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We implement comprehensive security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Encryption:</strong> All sensitive data is encrypted both in transit and at rest</li>
                <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can view relevant information</li>
                <li><strong>Authentication:</strong> Secure login systems with password protection and session management</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments and system monitoring</li>
                <li><strong>Data Backup:</strong> Regular backups to prevent data loss</li>
                <li><strong>Staff Training:</strong> Regular training for staff on data protection and privacy practices</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Data Sharing and Disclosure
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Emergency Situations:</strong> When necessary to protect student safety and well-being</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                <li><strong>Institutional Purposes:</strong> With other university departments for legitimate educational and administrative purposes</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in system operations (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Your Rights and Choices
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information stored in our system</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Update:</strong> Update your contact information and emergency contacts</li>
                <li><strong>Complaint:</strong> File complaints about privacy concerns through the system</li>
                <li><strong>Withdrawal:</strong> Request removal of certain non-essential information (subject to institutional requirements)</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, 
              comply with legal obligations, resolve disputes, and enforce agreements. Student records are typically 
              retained according to university record retention policies and applicable regulations.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Data Protection Officer</strong></p>
                <p>Email: privacy@dmu.edu</p>
                <p>Phone: +251-58-881-1234</p>
                <p>Office: Student Affairs Department</p>
                <p>Debre Markos University</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
              legal requirements, or other factors. We will notify users of any material changes through the system 
              notification feature or email communication.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}