"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  SignUpFormData,
  signUpDefaultValues,
  signUpSchema,
} from "../_types/schema";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { useSignUp } from "../_services/use-mutation";

export function SignUpForm() {
  const form = useForm<SignUpFormData>({
    defaultValues: signUpDefaultValues,
    resolver: zodResolver(signUpSchema),
  });

  const signUpMutation = useSignUp();

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form className="w-full max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Provide the required details to create your account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/sign-in">Login </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ControlledInput<SignUpFormData>
              name="name"
              label="Full Name"
              type="text"
            />
            <ControlledInput<SignUpFormData>
              name="email"
              label="Email"
              type="email"
            />
            <ControlledInput<SignUpFormData>
              name="password"
              label="Password"
              type="password"
            />

            <ControlledInput<SignUpFormData>
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              isLoading={signUpMutation.isPending}
              type="submit"
              size="lg"
              className="w-full"
            >
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
