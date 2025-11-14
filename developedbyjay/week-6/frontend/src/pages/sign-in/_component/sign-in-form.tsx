import { Link } from "react-router-dom";
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
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";

import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { useSignIn } from "../_services/use-mutation";
import {
  signInDefaultValues,
  signInSchema,
  type SignInFormData,
} from "../_types/schema";

export function SignInForm() {
  const form = useForm<SignInFormData>({
    defaultValues: signInDefaultValues,
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignIn();

  const onSubmit: SubmitHandler<SignInFormData> = (data) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="w-full m-auto p-4 sm:p-0 min-h-screen flex items-center justify-center">
      <FormProvider {...form}>
        <form
          className="w-full max-w-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Provide the required details to login to your account
              </CardDescription>
              <CardAction>
                <Button variant="link" asChild>
                  <Link to="/register">Sign up </Link>
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
    </div>
  );
}
