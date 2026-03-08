import { useState } from 'react';
import { ContactForm } from '../components/ContactForm.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@medianalyze.com',
      link: 'mailto:contact@medianalyze.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Medical Plaza, Healthcare District, CA 90210',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Send us a message
            and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{info.title}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Emergency Support</h3>
                <p className="text-sm text-blue-700 mb-3">
                  For urgent issues related to prescription analysis, please contact our
                  24/7 emergency support line.
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Call Emergency Line →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  How accurate is the analysis?
                </h4>
                <p className="text-sm text-gray-600">
                  Our AI system has been trained on millions of prescriptions and achieves
                  95%+ accuracy in medication identification and interaction detection.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes, we use industry-standard encryption and comply with HIPAA regulations
                  to ensure patient data privacy and security.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  What file formats are supported?
                </h4>
                <p className="text-sm text-gray-600">
                  We support JPG, PNG, and PDF files for prescription uploads. Images should
                  be clear and readable for best results.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can I integrate with my EHR system?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes, we offer API integration options for popular EHR systems. Contact us
                  for more information about enterprise integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
