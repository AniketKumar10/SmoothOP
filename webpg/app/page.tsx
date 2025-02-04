"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Chrome, Play } from "lucide-react"
import CountUp from "components/ui/CountUp"

export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false)

  const features = [
    {
      icon: "🔍",
      title: "Smart Form Autofill",
      description: "Auto-complete job applications with your profile data",
    },
    {
      icon: "🤖",
      title: "AI Answer Generator",
      description: "Get intelligent suggestions for application questions",
    },
    {
      icon: "📊",
      title: "Resume-Job Match Score",
      description: "See how well you match with each position",
    },
    {
      icon: "📱",
      title: "Cross-Platform Tracker",
      description: "Monitor all your applications in one place",
    },
  ]

  const stats = [
    { number: 90, label: "Less Application Time", suffix: "%" },
    { number: 75, label: "Higher Interview Rate", suffix: "%" },
    { number: 50, label: "Supported Job Platforms", suffix: "+" },
  ]

  const testimonials = [
    {
      quote: "Applied to 30 jobs in 4 hours - 8 interviews landed",
      author: "Sarah K.",
      role: "Software Engineer",
    },
    {
      quote: "The AI suggestions are incredibly helpful. Saved me hours!",
      author: "Michael R.",
      role: "Product Manager",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Automate Your Job Search in 1 Click
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Let AI handle form filling, resume optimization, and application tracking across 50+ job platforms
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" className="bg-[#38B2AC] hover:bg-[#319795]">
                <Chrome className="mr-2 h-5 w-5" />
                Get Started Free (Chrome)
              </Button>
              <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Watch 60-Second Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="about:blank" // Replace with actual demo video URL
                      title="Product Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-[#1A365D]">
                  <CountUp 
                    from={0} 
                    to={stat.number} 
                    separator="," 
                    direction="up" 
                    duration={2} 
                    className="count-up-text" 
                    suffix={stat.suffix}
                    onStart={() => {}} 
                    onEnd={() => {}} 
                  />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Save Your Profile", desc: "Complete your profile once, use it everywhere" },
              { step: 2, title: "Click to Apply", desc: "Let AI fill out job applications automatically" },
              { step: 3, title: "Track & Optimize", desc: "Monitor progress and improve your success rate" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-[#38B2AC] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-gray-600">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted & Secure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {["We never store your passwords", "100% user-owned data", "Open-source security audits"].map(
              (text, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="text-[#48BB78]" />
                  <span>{text}</span>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Job Search?</h2>
          <Button size="lg" className="bg-[#38B2AC] hover:bg-[#319795]">
            <Chrome className="mr-2 h-5 w-5" />
            Add to Chrome - Free Forever Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}