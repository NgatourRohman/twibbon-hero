import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="container-page relative grid min-h-[calc(100svh-5rem)] place-items-center overflow-hidden py-10 sm:min-h-[78vh] sm:py-16">
      <div className="absolute left-[12%] top-[16%] size-52 rounded-full bg-violet-300/25 blur-3xl" />
      <div className="absolute bottom-[12%] right-[14%] size-60 rounded-full bg-sky-300/20 blur-3xl" />
      <Card className="premium-border relative w-full max-w-md rounded-[24px] shadow-[0_35px_80px_-35px_rgba(45,35,105,.45)] sm:rounded-3xl">
        <CardContent className="p-5 sm:p-9">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-white text-primary shadow-clay">
            <Sparkles className="size-5" />
          </span>
          <h1 className="gradient-text mt-5 text-center font-[var(--font-display)] text-[1.75rem] font-extrabold sm:text-3xl">
            Welcome back
          </h1>
          <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">
            Continue building movements that matter.
          </p>
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
