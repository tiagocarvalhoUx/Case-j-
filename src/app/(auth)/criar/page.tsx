import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function CriarPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
