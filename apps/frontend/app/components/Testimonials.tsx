import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO at TechStart',
      company: 'TechStart Inc.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      content: 'MonitorPro has been a game-changer for our infrastructure monitoring. The instant alerts saved us from multiple potential disasters.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'DevOps Engineer',
      company: 'CloudScale Solutions',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      content: 'The detailed reporting and analytics have helped us improve our uptime from 99.5% to 99.98%. Outstanding service!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'EcomHub',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      content: 'Simple setup, reliable monitoring, and excellent customer support. MonitorPro is essential for our e-commerce platform.',
      rating: 5
    },
    {
      name: 'David Park',
      role: 'IT Director',
      company: 'FinanceFlow',
      avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      content: 'The global monitoring locations give us confidence that our services are accessible worldwide. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Trusted by thousands of developers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what our customers say about their experience with MonitorPro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300 bg-gray-800"
            >
              <div className="mb-6">
                <Quote className="w-8 h-8 text-blue-600 mb-4" />
                <p className="text-gray-300 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-300 text-sm">{testimonial.role}</div>
                  <div className="text-gray-400 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;