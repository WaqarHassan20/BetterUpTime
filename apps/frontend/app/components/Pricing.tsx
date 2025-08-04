import React from 'react';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for small websites and personal projects',
      features: [
        'Monitor up to 5 websites',
        'Check every 5 minutes',
        'Email notifications',
        'Basic reporting',
        '1 team member',
        '30-day data retention'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses and agencies',
      features: [
        'Monitor up to 25 websites',
        'Check every 1 minute',
        'Email, SMS & Slack alerts',
        'Advanced reporting',
        '5 team members',
        '1-year data retention',
        'SSL monitoring',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with critical infrastructure',
      features: [
        'Monitor unlimited websites',
        'Check every 30 seconds',
        'All notification channels',
        'Custom reporting',
        'Unlimited team members',
        'Unlimited data retention',
        'Priority support',
        'Custom integrations',
        'SLA guarantees'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 bg-gray-900 shadow-lg scale-105' 
                  : 'border-gray-600 bg-gray-900 hover:border-gray-500'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Start Free Trial
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <a href="#contact" className="text-blue-400 hover:text-blue-300 font-medium">
            Need a custom plan? Contact us →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;