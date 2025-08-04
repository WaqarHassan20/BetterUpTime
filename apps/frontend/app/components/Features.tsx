import React from 'react';
import { 
  Bell, 
  Globe, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Zap,
  Clock,
  Users
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: 'Global Monitoring',
      description: 'Monitor from 15+ locations worldwide to ensure your website is accessible everywhere.'
    },
    {
      icon: <Bell className="w-8 h-8 text-green-600" />,
      title: 'Instant Alerts',
      description: 'Get notified immediately via email, SMS, Slack, or webhook when your site goes down.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: 'Detailed Reports',
      description: 'Comprehensive uptime reports, performance metrics, and historical data analysis.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'SSL Monitoring',
      description: 'Track SSL certificate expiration dates and get alerts before they expire.'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
      title: 'Mobile App',
      description: 'Monitor your websites on-the-go with our native iOS and Android applications.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: 'Lightning Fast',
      description: 'Sub-second response times and real-time monitoring with minimal false positives.'
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      title: '24/7 Monitoring',
      description: 'Round-the-clock monitoring with checks every 30 seconds to catch issues instantly.'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: 'Team Collaboration',
      description: 'Share access with your team, assign responsibilities, and manage incidents together.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Everything you need to monitor your websites
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive monitoring tools designed to keep your business online and your customers happy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-gray-700 hover:border-gray-600 hover:shadow-lg bg-gray-800 transition-all duration-300 group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;