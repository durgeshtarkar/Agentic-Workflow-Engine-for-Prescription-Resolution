import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Activity, Upload, Shield, BarChart3, ArrowRight, CheckCircle, Zap, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Activity,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze prescriptions for potential issues and interactions.',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Identify drug interactions, contraindications, and dosage errors before they become problems.',
      color: 'green',
    },
    {
      icon: BarChart3,
      title: 'Detailed Reports',
      description: 'Get comprehensive analysis reports with risk levels and actionable recommendations.',
      color: 'purple',
    },
  ];

  const benefits = [
    'Real-time prescription analysis',
    'Drug interaction detection',
    'Dosage verification',
    'Patient history tracking',
    'Compliance monitoring',
    'Evidence-based recommendations',
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Healthcare Professionals' },
    { icon: Zap, value: '99.9%', label: 'Accuracy Rate' },
    { icon: Clock, value: '<2min', label: 'Average Analysis Time' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1695048441357-b5fab05fa63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVjaG5vbG9neSUyMGRpZ2l0YWwlMjBoZWFsdGh8ZW58MXx8fHwxNzcyMzg5MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Healthcare Technology"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold">🏥 Trusted by Healthcare Professionals</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI-Powered
                <span className="block text-blue-200">Prescription Analysis</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Empower your practice with intelligent prescription analysis. Detect drug interactions, 
                verify dosages, and ensure patient safety in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link to="/upload">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Prescription
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-2xl transform rotate-3"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1659353886114-9aa119aef5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBhbmFseXppbmclMjBwcmVzY3JpcHRpb24lMjBtZWRpY2FsfGVufDF8fHx8MTc3MjM4OTA1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Doctor analyzing prescription"
                  className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              Powerful Tools for Healthcare Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to ensure prescription safety and accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559298947-270ce106ac00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjaXN0JTIwbWVkaWNhdGlvbiUyMHBoYXJtYWN5fGVufDF8fHx8MTc3MjM4OTA1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pharmacist"
                  className="rounded-2xl shadow-lg h-64 object-cover"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1655313719493-16ebe4906441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGV0aG9zY29wZSUyMG1lZGljYWwlMjBlcXVpcG1lbnQlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc3MjM4OTA1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Medical Equipment"
                  className="rounded-2xl shadow-lg h-64 object-cover mt-8"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Why Choose Us</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
                Transform Your Prescription Workflow
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform combines cutting-edge AI technology with medical expertise to
                provide comprehensive prescription analysis that helps prevent medication
                errors and improves patient outcomes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to transform your practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4">
                  1
                </div>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription className="text-base">
                  Sign up as a doctor or pharmacist to access the platform. Quick verification process.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4">
                  2
                </div>
                <CardTitle>Upload Prescription</CardTitle>
                <CardDescription className="text-base">
                  Upload prescription images or enter data manually. Supports multiple formats.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-4">
                  3
                </div>
                <CardTitle>Get Instant Analysis</CardTitle>
                <CardDescription className="text-base">
                  Receive detailed analysis with recommendations and alerts in under 2 minutes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762237798212-bcc000c00891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMGhvc3BpdGFsJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjM1MzY5MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Medical Team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Prescription Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of healthcare professionals who trust MediAnalyze for prescription safety
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                  Sign Up Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
