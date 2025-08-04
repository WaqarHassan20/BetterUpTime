"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiShield, FiMonitor, FiZap, FiGlobe, FiCheck, FiArrowRight, FiActivity, FiBarChart, FiClock, FiBell, FiTrendingUp, FiUsers } from 'react-icons/fi';

function App() {
  const router = useRouter();
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-500 opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 rounded-full bg-purple-500 opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-green-500 opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                UpTime Monitor
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Reviews</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/signin")} 
                className="text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-gray-800/50 font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push("/signup")} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                Start Free Trial
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-green-900/30 border border-green-500/50 text-green-300 rounded-2xl text-sm font-medium backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              99.9% uptime guarantee
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Monitor your website's
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                  uptime like a pro
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                Get instant alerts when your website goes down. Comprehensive monitoring, 
                detailed reports, and lightning-fast notifications to keep your business running smoothly.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button 
                onClick={() => router.push("/signup")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
              >
                Start 14-day free trial
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm">
                See live demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 pt-12 text-gray-400">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-3">
                <FiZap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Setup in 30 seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <FiShield className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Enterprise security</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="relative max-w-6xl mx-auto">
              <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                <div className="bg-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden">
                  {/* Mock Dashboard Header */}
                  <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-sm font-medium">UpTime Monitor Dashboard</div>
                    </div>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Status Card */}
                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <FiActivity className="w-5 h-5 text-green-400" />
                          <span className="text-green-300 font-medium">All Systems Operational</span>
                        </div>
                        <div className="text-2xl font-bold text-white">99.9%</div>
                        <div className="text-green-400 text-sm">Uptime this month</div>
                      </div>

                      {/* Response Time Card */}
                      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <FiClock className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-300 font-medium">Avg Response Time</span>
                        </div>
                        <div className="text-2xl font-bold text-white">247ms</div>
                        <div className="text-blue-400 text-sm">Last 24 hours</div>
                      </div>

                      {/* Incidents Card */}
                      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <FiBell className="w-5 h-5 text-purple-400" />
                          <span className="text-purple-300 font-medium">Incidents</span>
                        </div>
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-purple-400 text-sm">This week</div>
                      </div>
                    </div>

                    {/* Mock Chart Area */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Response Time Trends</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiTrendingUp className="w-4 h-4 text-green-400" />
                          +2.3% improvement
                        </div>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-end justify-between p-4">
                        {[60, 45, 80, 35, 90, 55, 70, 40, 85, 50, 75, 65].map((height, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm opacity-70"
                            style={{ height: `${height}%`, width: '6%' }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {' '}monitor with confidence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive monitoring tools designed for modern websites and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiMonitor,
                title: "24/7 Website Monitoring",
                description: "Continuous monitoring of your websites with checks every 30 seconds from multiple global locations."
              },
              {
                icon: FiGlobe,
                title: "Global Network",
                description: "Monitor from 15+ locations worldwide to ensure your site is accessible everywhere."
              },
              {
                icon: FiBell,
                title: "Instant Alerts",
                description: "Get notified immediately via email, SMS, Slack, or webhook when issues are detected."
              },
              {
                icon: FiBarChart,
                title: "Detailed Analytics",
                description: "Comprehensive reports and analytics to understand your website's performance patterns."
              },
              {
                icon: FiShield,
                title: "SSL Monitoring",
                description: "Monitor SSL certificate expiration and get alerts before certificates expire."
              },
              {
                icon: FiUsers,
                title: "Team Collaboration",
                description: "Share dashboards and alerts with your team for better incident response."
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/60 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to ensure your website
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                never goes down?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses that trust UpTime Monitor to keep their websites running smoothly.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => router.push("/signup")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                Start monitoring now
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button 
                onClick={() => router.push("/signin")}
                className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800/50 transition-all duration-300"
              >
                Sign in to dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                UpTime Monitor
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 UpTime Monitor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;