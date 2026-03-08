import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, Target, Users, Zap, GitBranch, Shield, Award, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function About() {
  const features = [
    {
      icon: Activity,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms process prescription data to identify potential issues.',
    },
    {
      icon: Shield,
      title: 'Safety Verification',
      description: 'Multi-layer verification system checks for drug interactions, contraindications, and dosage errors.',
    },
    {
      icon: GitBranch,
      title: 'Workflow Automation',
      description: 'Automated agentic workflow streamlines the analysis process from upload to recommendation.',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Instant analysis and feedback to support quick clinical decision-making.',
    },
  ];

  const workflow = [
    {
      step: 1,
      title: 'Data Ingestion',
      description: 'Prescription images or text are uploaded and preprocessed using OCR and NLP techniques.',
    },
    {
      step: 2,
      title: 'Information Extraction',
      description: 'AI agents extract medication names, dosages, frequencies, and patient information.',
    },
    {
      step: 3,
      title: 'Safety Analysis',
      description: 'Multiple AI agents check for drug interactions, contraindications, and dosage accuracy.',
    },
    {
      step: 4,
      title: 'Risk Assessment',
      description: 'Risk scoring algorithm evaluates overall prescription safety and generates alerts.',
    },
    {
      step: 5,
      title: 'Recommendation Generation',
      description: 'Evidence-based recommendations are generated for healthcare professionals.',
    },
  ];

  const teamMembers = [
    { name: 'Dr. Sarah Johnson', role: 'Clinical Lead', expertise: 'Pharmacology' },
    { name: 'Michael Chen', role: 'AI/ML Engineer', expertise: 'Deep Learning' },
    { name: 'Dr. Robert Williams', role: 'Medical Advisor', expertise: 'Internal Medicine' },
    { name: 'Emily Davis', role: 'Full Stack Developer', expertise: 'Healthcare IT' },
  ];

  const achievements = [
    { icon: Award, value: '99.9%', label: 'Detection Accuracy' },
    { icon: Users, value: '10,000+', label: 'Users Worldwide' },
    { icon: TrendingUp, value: '50%', label: 'Error Reduction' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1768498950637-88d073faa491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwcmVzZWFyY2glMjBtZWRpY2FsJTIwYW5hbHlzaXN8ZW58MXx8fHwxNzcyMzg5MDUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Laboratory Research"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Activity className="h-20 w-20 text-white mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl font-bold text-white mb-6">
            About MediAnalyze
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            An intelligent workflow engine that leverages AI agents to analyze prescriptions,
            detect errors, and improve patient safety in healthcare settings.
          </p>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <achievement.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{achievement.value}</div>
                <div className="text-sm text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To reduce medication errors and improve patient outcomes by providing healthcare
                professionals with advanced AI-powered prescription analysis tools. We aim to make
                prescription verification faster, more accurate, and accessible to all healthcare
                providers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment is to bridge the gap between cutting-edge technology and practical 
                healthcare applications, ensuring that every prescription is analyzed with the highest 
                level of accuracy and care.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl transform -rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMGhvc3BpdGFsJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjM1MzY5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical Team"
                className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-500 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">How It Works</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Agentic Workflow Process
            </h2>
            <p className="text-xl text-gray-600">
              How our AI-powered system analyzes prescriptions
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="space-y-8">
              {workflow.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <Card className="ml-6 flex-1 border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <CardDescription className="text-base">{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  {index < workflow.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-indigo-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Experts in medicine, AI, and healthcare technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center border-2 hover:shadow-xl hover:scale-105 transition-all">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-lg">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full">
                    {member.expertise}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern, reliable, and scalable technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-blue-500 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>React.js with TypeScript</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>Tailwind CSS for styling</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>React Router for navigation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>Modern UI components</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Backend (Integration Ready)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span>FastAPI / Flask support</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span>RESTful API architecture</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span>Secure authentication</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span>Database integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
