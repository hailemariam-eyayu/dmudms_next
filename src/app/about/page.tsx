import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Users, Building, Shield, BarChart3, Zap, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Dormitory Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive digital solution designed to transform dormitory administration 
            into a seamless, efficient, and transparent process.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              We believe that technology should enhance the educational experience, not complicate it. 
              Our Dormitory Management System is built to create harmony between students, staff, and 
              administrators by providing intuitive tools that streamline operations while maintaining 
              the human touch that makes campus life special.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Student-Centric Design</h3>
                </div>
                <p className="text-gray-600">
                  Built with students in mind, providing transparent room assignments, 
                  easy request submissions, and clear communication channels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Security First</h3>
                </div>
                <p className="text-gray-600">
                  Comprehensive emergency reporting, proctor management, and incident 
                  tracking ensure a safe living environment for all residents.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Data-Driven Insights</h3>
                </div>
                <p className="text-gray-600">
                  Advanced analytics and reporting provide administrators with the 
                  insights needed to optimize operations and improve student satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-8 w-8 text-yellow-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Lightning Fast</h3>
                </div>
                <p className="text-gray-600">
                  Built with modern web technologies and optimized for performance, 
                  ensuring quick response times and smooth user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Technology Stack</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 15 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deployment</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vercel for hosting</li>
                  <li>• Edge functions for performance</li>
                  <li>• Global CDN distribution</li>
                  <li>• Automatic HTTPS</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Migration from Laravel */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Modernization Journey</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed mb-4">
              This system represents a complete modernization of the original Laravel-based 
              dormitory management system. We've migrated to a modern Next.js architecture 
              to provide:
            </p>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li>• Better performance with static generation and edge computing</li>
              <li>• Improved user experience with modern React components</li>
              <li>• Enhanced scalability through serverless architecture</li>
              <li>• Simplified deployment and maintenance on Vercel</li>
              <li>• Future-ready codebase with TypeScript</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-900">Get in Touch</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 mb-2">
                  Need help with the system? Our support team is here to assist you.
                </p>
                <p className="text-blue-600">support@dmu.edu</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Development</h3>
                <p className="text-gray-600 mb-2">
                  Interested in contributing or have technical questions?
                </p>
                <p className="text-blue-600">dev@dmu.edu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}