'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import type { UserRole } from '@/lib/types';

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 50 }, (_, i) => currentYear - i);
const enrollmentYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

const majors = [
  'Computer Science',
  'Data Science',
  'Business Administration',
  'Finance',
  'Marketing',
  'Engineering',
  'Medicine',
  'Law',
  'Arts & Humanities',
  'Natural Sciences',
  'Social Sciences',
  'Education',
  'Other',
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'alumni' | 'student') || 'student';
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'alumni' | 'student'>(defaultRole);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Alumni fields
    graduationYear: '',
    degree: '',
    major: '',
    currentCompany: '',
    currentPosition: '',
    // Student fields
    enrollmentYear: '',
    expectedGraduation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please enter and confirm your password');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (role === 'alumni') {
      if (!formData.graduationYear || !formData.degree || !formData.major) {
        setError('Please fill in all required fields');
        return false;
      }
    } else {
      if (!formData.enrollmentYear || !formData.major || !formData.expectedGraduation) {
        setError('Please fill in all required fields');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role as UserRole,
        ...(role === 'alumni'
          ? {
              graduationYear: parseInt(formData.graduationYear),
              degree: formData.degree,
              major: formData.major,
              currentCompany: formData.currentCompany,
              currentPosition: formData.currentPosition,
            }
          : {
              enrollmentYear: parseInt(formData.enrollmentYear),
              major: formData.major,
              expectedGraduation: parseInt(formData.expectedGraduation),
            }),
      };

      const result = await api.auth.register(userData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">AlumniConnect</span>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Security' : 'Profile Details'}
              </CardDescription>
              {/* Progress indicator */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="space-y-2">
                      <Label>I am a...</Label>
                      <RadioGroup
                        value={role}
                        onValueChange={(value) => setRole(value as 'alumni' | 'student')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student" id="student" />
                          <Label htmlFor="student" className="cursor-pointer">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="alumni" id="alumni" />
                          <Label htmlFor="alumni" className="cursor-pointer">Alumni</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@university.edu"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Security */}
                {step === 2 && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Min. 8 characters"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter your password"
                        required
                      />
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Password must:</p>
                      <ul className="list-disc list-inside">
                        <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                          Be at least 8 characters
                        </li>
                        <li className={formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}>
                          Match confirmation
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Profile Details */}
                {step === 3 && (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {role === 'alumni' ? (
                      <>
                        <div className="space-y-2">
                          <Label>Graduation Year *</Label>
                          <Select
                            value={formData.graduationYear}
                            onValueChange={(value) => handleSelectChange('graduationYear', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {graduationYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree *</Label>
                          <Select
                            value={formData.degree}
                            onValueChange={(value) => handleSelectChange('degree', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bachelor of Science">Bachelor of Science</SelectItem>
                              <SelectItem value="Bachelor of Arts">Bachelor of Arts</SelectItem>
                              <SelectItem value="Master of Science">Master of Science</SelectItem>
                              <SelectItem value="Master of Arts">Master of Arts</SelectItem>
                              <SelectItem value="Master of Business Administration">MBA</SelectItem>
                              <SelectItem value="Doctor of Philosophy">PhD</SelectItem>
                              <SelectItem value="Doctor of Medicine">MD</SelectItem>
                              <SelectItem value="Juris Doctor">JD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Major *</Label>
                          <Select
                            value={formData.major}
                            onValueChange={(value) => handleSelectChange('major', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select major" />
                            </SelectTrigger>
                            <SelectContent>
                              {majors.map((major) => (
                                <SelectItem key={major} value={major}>
                                  {major}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentCompany">Current Company</Label>
                          <Input
                            id="currentCompany"
                            name="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleInputChange}
                            placeholder="Company name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentPosition">Current Position</Label>
                          <Input
                            id="currentPosition"
                            name="currentPosition"
                            value={formData.currentPosition}
                            onChange={handleInputChange}
                            placeholder="e.g., Software Engineer"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Enrollment Year *</Label>
                          <Select
                            value={formData.enrollmentYear}
                            onValueChange={(value) => handleSelectChange('enrollmentYear', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {enrollmentYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Expected Graduation *</Label>
                          <Select
                            value={formData.expectedGraduation}
                            onValueChange={(value) => handleSelectChange('expectedGraduation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 8 }, (_, i) => currentYear + i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Major *</Label>
                          <Select
                            value={formData.major}
                            onValueChange={(value) => handleSelectChange('major', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select major" />
                            </SelectTrigger>
                            <SelectContent>
                              {majors.map((major) => (
                                <SelectItem key={major} value={major}>
                                  {major}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-6">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} className="flex-1">
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8">
        <motion.div 
          className="text-center text-primary-foreground max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GraduationCap className="h-20 w-20 mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">
            Join the Alumni Network
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Connect with thousands of alumni and students. Find mentors, discover opportunities, and grow together.
          </p>
          <div className="space-y-4 text-left">
            {[
              'Access exclusive job postings',
              'Connect with industry mentors',
              'Attend networking events',
              'Build lifelong relationships',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
