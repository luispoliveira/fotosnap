"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupFormData, signupSchema } from "@/lib/auth/schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const handleSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="name" placeholder="Enter your full name" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>)}>
            </FormField>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>)}>
            </FormField>
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter a password" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>)}>
            </FormField>
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>)}>
            </FormField>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating acount ...' : 'Create Acount'}
            </Button>
          </form>
        </Form>
      </CardContent >
    </Card >
  )
}