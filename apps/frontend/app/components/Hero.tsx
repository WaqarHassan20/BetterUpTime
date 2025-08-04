import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                99.9% uptime guarantee
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Monitor your website's
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {' '}uptime{' '}
                </span>
                like a pro
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Get instant alerts when your website goes down. Comprehensive monitoring, 
                detailed reports, and lightning-fast notifications to keep your business running smoothly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group">
                Start 14-day free trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                See live demo
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Setup in 30 seconds
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Website Status</h3>
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      All systems operational
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'example.com', status: 'up', response: '247ms' },
                      { name: 'api.example.com', status: 'up', response: '156ms' },
                      { name: 'cdn.example.com', status: 'up', response: '89ms' },
                    ].map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-white">{site.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{site.response}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Uptime (30 days)</span>
                      <span className="font-semibold text-green-600">99.98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;