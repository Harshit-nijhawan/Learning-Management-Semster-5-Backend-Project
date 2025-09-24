import { useState, useEffect } from 'react';
import React  from 'react';
import Navbar from '../components/Navbar';
const home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSmoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const features = [
    {
      icon: '📚',
      title: 'Course Management',
      description: 'Create, organize, and deliver engaging courses with our intuitive course builder and content management system.'
    },
    {
      icon: '👥',
      title: 'Student Engagement',
      description: 'Keep learners motivated with discussion forums, assignments, quizzes, and real-time progress tracking.'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Monitor student performance with detailed analytics, reports, and insights to improve learning outcomes.'
    },
    {
      icon: '📱',
      title: 'Mobile Learning',
      description: 'Access courses anywhere with our responsive design and mobile apps for iOS and Android devices.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption, secure authentication, and 99.9% uptime guarantee.'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'AI-powered recommendations and adaptive learning paths tailored to each student\'s needs and pace.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'High School Teacher',
      image: '👩‍🏫',
      content: 'LearnHub has completely transformed how I deliver lessons. My students are more engaged than ever, and I can easily track their progress.'
    },
    {
      name: 'Mark Thompson',
      role: 'University Professor',
      image: '👨‍💼',
      content: 'The analytics feature helps me understand which students need extra support. It\'s made my teaching much more effective.'
    },
    {
      name: 'Lisa Chen',
      role: 'Corporate Trainer',
      image: '👩‍💻',
      content: 'We\'ve trained over 500 employees using LearnHub. The platform is intuitive and our completion rates have improved dramatically.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individual educators',
      features: [
        'Up to 100 students',
        '5 courses',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Best for schools and institutions',
      features: [
        'Up to 500 students',
        'Unlimited courses',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'Integration support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited students',
        'Unlimited courses',
        'White-label solution',
        '24/7 phone support',
        'Custom integrations',
        'Dedicated account manager'
      ],
      popular: false
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '2K+', label: 'Educators' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Header */}
     <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">LearnHub</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'Pricing', 'About'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSmoothScroll(item.toLowerCase())}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button classN ame="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                Sign In
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Modern Learning
                <span className="text-blue-600 block">Made Simple</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Empower educators and engage students with our comprehensive learning management system. 
                Create courses, track progress, and deliver exceptional educational experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 hover:-translate-y-1 shadow-lg">
                  Start Free Trial
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">14-Day</div>
                  <div className="text-sm text-gray-600">Free Trial</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">No</div>
                  <div className="text-sm text-gray-600">Credit Card</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-2xl p-10 text-center space-y-6">
  {/* Hero Heading */}
  <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">
    Unlock Your Potential with <span className="text-yellow-300">Mathematics Mastery</span>
  </h1>
  <p className="text-blue-100 max-w-xl mx-auto">
    Learn from expert instructors, boost your problem-solving skills, and join a growing community of learners achieving academic success.
  </p>

  {/* Highlights */}
  <div className="grid grid-cols-3 gap-6">
    <div className="bg-white/10 p-4 rounded-xl">
      <div className="text-2xl font-bold text-yellow-300">24K+</div>
      <div className="text-sm">Happy Students</div>
    </div>
    <div className="bg-white/10 p-4 rounded-xl">
      <div className="text-2xl font-bold text-green-300">4.8★</div>
      <div className="text-sm">Top Rated</div>
    </div>
    <div className="bg-white/10 p-4 rounded-xl">
      <div className="text-2xl font-bold text-pink-300">100%</div>
      <div className="text-sm">Beginner Friendly</div>
    </div>
  </div>

  {/* Call to Action */}
  <button className="mt-4 bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition">
    🚀 Start Learning Today
  </button>

  {/* Social Proof */}
  <p className="text-xs text-blue-200">Trusted by students in 30+ countries</p>
</div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools educators and students need for effective online learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their experience
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{testimonials[activeTestimonial].image}</span>
                </div>
                <blockquote className="text-2xl text-gray-700 font-medium leading-relaxed mb-6">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[activeTestimonial].role}</div>
              </div>
              
              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your educational needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular 
                    ? 'ring-2 ring-blue-600 shadow-xl scale-105' 
                    : 'shadow-sm hover:shadow-md'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of educators who have already revolutionized their classrooms with LearnHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 hover:-translate-y-1 shadow-lg">
              Start Your Free Trial
            </button>
            <button className="border-2 border-blue-300 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold">LearnHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Making education accessible and engaging for everyone, everywhere.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 LearnHub. All rights reserved. Built with ❤️ for educators.</p>
          </div>
        </div>
        <div className='Features grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 relative z-10'>
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray mb-2">10K+</div>
                          <div className="text-gray-500 text-sm">Active Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray mb-2">500+</div>
                          <div className="text-gray-500 text-sm">Expert Courses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray mb-2">98%</div>
                          <div className="text-gray-500 text-sm">Success Rate</div>
                        </div>
                      </div>
      </footer>
    </div>
  );
};

export default home;