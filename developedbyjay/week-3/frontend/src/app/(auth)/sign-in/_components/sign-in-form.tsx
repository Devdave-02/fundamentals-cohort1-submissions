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
  SignInFormData,
  signInDefaultValues,
  signInSchema,
} from "../_types/schema";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { useSignIn } from "../_services/use-mutation";

export function SignInForm() {
  const form = useForm<SignInFormData>({
    defaultValues: signInDefaultValues,
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignIn();

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    signInMutation.mutate(data)
  };

  return (
    <FormProvider {...form}>
      <form className="w-full max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Provide the required details to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/sign-up">Sign up </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ControlledInput<SignInFormData>
              name="email"
              label="Email"
              type="email"
            />
            <ControlledInput<SignInFormData>
              name="password"
              label="Password"
              type="password"
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              isLoading={signInMutation.isPending}
              type="submit"
              size="lg"
              className="w-full"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
