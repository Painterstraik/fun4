"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@example.com",
      password: "Admin123!"
    }
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password
    });

    if (response?.error) {
      setError("Login fehlgeschlagen. Bitte pruefen.");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">E-Mail</label>
            <Input type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">Ungueltige E-Mail.</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Passwort</label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">Passwort ist erforderlich.</p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">
            Einloggen
          </Button>
        </form>
        <div className="mt-4 rounded-md bg-slate-100 p-3 text-xs text-slate-600">
          <p>Admin Login: admin@example.com / Admin123!</p>
        </div>
      </CardContent>
    </Card>
  );
}
