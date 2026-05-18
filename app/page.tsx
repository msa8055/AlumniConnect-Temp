'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  Award,
  ArrowRight,
  CheckCircle2,
  Star,
  Building2,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">AlumniConnect</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6">
                <Star className="h-3 w-3 mr-1" />
                Trusted by 50+ Universities Worldwide
              </Badge>
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              variants={fadeInUp}
            >
              Connect, Grow, and{' '}
              <span className="gradient-text">Succeed Together</span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
              variants={fadeInUp}
            >
              The complete alumni management platform that bridges the gap between students, 
              alumni, and opportunities. Build meaningful connections that last a lifetime.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Join the Network
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In to Your Account
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: 'Live', label: 'Alumni Directory' },
              { value: 'Live', label: 'Job Posts' },
              { value: 'Live', label: 'Mentorships' },
              { value: 'Live', label: 'Events' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card border">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Everything You Need to Build Your Network
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              From job opportunities to mentorship programs, we provide all the tools 
              you need to connect and grow professionally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Job Board',
                description: 'Access exclusive job postings from alumni-led companies and trusted partners.',
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-950/30'
              },
              {
                icon: Users,
                title: 'Mentorship Program',
                description: 'Connect with experienced alumni mentors who can guide your career journey.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-950/30'
              },
              {
                icon: Calendar,
                title: 'Events & Networking',
                description: 'Join exclusive events, workshops, and networking sessions.',
                color: 'text-purple-600',
                bg: 'bg-purple-50 dark:bg-purple-950/30'
              },
              {
                icon: MessageCircle,
                title: 'Direct Messaging',
                description: 'Reach out directly to alumni and peers for advice and opportunities.',
                color: 'text-orange-600',
                bg: 'bg-orange-50 dark:bg-orange-950/30'
              },
              {
                icon: Building2,
                title: 'Company Directory',
                description: 'Discover companies founded or led by alumni from your university.',
                color: 'text-cyan-600',
                bg: 'bg-cyan-50 dark:bg-cyan-950/30'
              },
              {
                icon: TrendingUp,
                title: 'Career Resources',
                description: 'Access resume reviews, interview prep, and career development tools.',
                color: 'text-pink-600',
                bg: 'bg-pink-50 dark:bg-pink-950/30'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Get Started in Minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build your professional profile with your education, experience, and interests.',
              },
              {
                step: '02',
                title: 'Connect & Explore',
                description: 'Browse alumni directory, discover job opportunities, and join mentorship programs.',
              },
              {
                step: '03',
                title: 'Grow Together',
                description: 'Attend events, build relationships, and advance your career with the alumni community.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
              Ready to Join the Community?
            </h2>
            <p className="text-muted-foreground mb-8 text-pretty">
              Whether you&apos;re a student looking for guidance or an alumni wanting to give back, 
              AlumniConnect is the place to grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=student">
                <Button size="lg" className="w-full sm:w-auto">
                  I&apos;m a Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=alumni">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  I&apos;m an Alumni
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold">AlumniConnect</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Building bridges between students and alumni for a brighter future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-foreground transition-colors">Job Board</Link></li>
                <li><Link href="/events" className="hover:text-foreground transition-colors">Events</Link></li>
                <li><Link href="/mentorship" className="hover:text-foreground transition-colors">Mentorship</Link></li>
                <li><Link href="/directory" className="hover:text-foreground transition-colors">Alumni Directory</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/guidelines" className="hover:text-foreground transition-colors">Community Guidelines</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>alumni@university.edu</li>
                <li>+1 (555) 123-4567</li>
                <li>123 University Ave</li>
                <li>Campus, ST 12345</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
