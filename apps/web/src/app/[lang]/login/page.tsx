"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { users, useAppStore } from "@insurance/lib";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";
import { Shield, Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const setToken = useAppStore((s) => s.setToken);
  const addNotification = useAppStore((s) => s.addNotification);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === email
    );
    if (!found) {
      setError("User not found with this email/mobile");
      return;
    }
    setError("");
    setStep("otp");
    addNotification({
      id: `otp-${Date.now()}`,
      title: "OTP Sent",
      message: "Your OTP 1234 has been sent to your registered mobile",
      type: "info",
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const handleVerifyOtp = () => {
    if (otp !== "1234") {
      setError("Invalid OTP. Please use 1234");
      return;
    }
    setError("");

    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === email
    );
    if (found) {
      const token = `token_${found.id}_${Date.now()}`;
      setToken(token);
      setUser(found);
      addNotification({
        id: `login-${Date.now()}`,
        title: "Login Successful",
        message: `Welcome back, ${found.name}!`,
        type: "success",
        read: false,
        createdAt: new Date().toISOString()
      });
      router.push(`/en/dashboard`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {t("app.name")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t("app.tagline")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === "email" ? "Sign In" : "Verify OTP"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === "email" ? (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Email or Mobile Number"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && email && handleSendOtp()}
                  />
                </div>
                <Button className="w-full" onClick={handleSendOtp} disabled={!email.trim()}>
                  Send OTP
                </Button>
                <p className="text-center text-xs text-gray-400">
                  Demo: Use admin@insurance.com or +971500000001
                </p>
              </>
            ) : (
              <>
                <p className="text-center text-sm text-gray-600">
                  OTP sent to {email}
                </p>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10 text-center text-2xl tracking-[0.5em]"
                    placeholder="1234"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && otp.length === 4 && handleVerifyOtp()}
                  />
                </div>
                <Button className="w-full" onClick={handleVerifyOtp} disabled={otp.length !== 4}>
                  Verify & Sign In
                </Button>
                <button
                  className="w-full text-center text-sm text-indigo-600 hover:underline"
                  onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                >
                  Change email/mobile
                </button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Demo Users Info */}
        <div className="space-y-1 text-center text-xs text-gray-400">
          <p>Demo accounts: admin@insurance.com, manager@insurance.com</p>
          <p>OTP: 1234 (default)</p>
        </div>
      </div>
    </div>
  );
}