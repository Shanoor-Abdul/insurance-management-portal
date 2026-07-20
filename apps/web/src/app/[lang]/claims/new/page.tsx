"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPolicies, createClaim, type Policy } from "@insurance/lib";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";

export default function NewClaimPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();

  const { data: policies = [] } = useQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies()
  });

  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const selectedPolicy = policies.find((p: Policy) => p.id === selectedPolicyId);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!selectedPolicy) throw new Error("No policy selected");
      return createClaim({
        policyId: selectedPolicy.id,
        policyNumber: selectedPolicy.policyNumber,
        customer: {
          name: selectedPolicy.customer.name,
          email: selectedPolicy.customer.email,
          mobile: selectedPolicy.customer.mobile
        },
        lob: selectedPolicy.lob,
        amount: Number(amount),
        notes
      });
    },
    onSuccess: () => {
      router.push(`/${lang}/claims`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicyId) return;
    if (!amount || Number(amount) <= 0) return;
    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{t("claims.create")}</h1>

      <Card>
        <CardHeader><CardTitle>Select Policy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Policy</label>
            <select
              className="w-full rounded border border-gray-300 p-2 text-sm"
              value={selectedPolicyId}
              onChange={(e) => { setSelectedPolicyId(e.target.value); setAmount(""); }}
            >
              <option value="">-- Select a policy --</option>
              {policies.map((p: Policy) => (
                <option key={p.id} value={p.id}>
                  {p.policyNumber} - {p.customer.name} ({p.lob}) - ${p.premium}
                </option>
              ))}
            </select>
          </div>

          {selectedPolicy && (
            <div className="rounded-lg border bg-gray-50 p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-base">Policy Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Policy #:</span> {selectedPolicy.policyNumber}</div>
                <div><span className="font-medium">Customer:</span> {selectedPolicy.customer.name}</div>
                <div><span className="font-medium">LOB:</span> {selectedPolicy.lob}</div>
                <div><span className="font-medium">Premium:</span> ${selectedPolicy.premium}</div>
                <div><span className="font-medium">Status:</span> {selectedPolicy.status}</div>
                <div><span className="font-medium">Coverage:</span> {selectedPolicy.coverage}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Claim Amount ($)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter claim amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {selectedPolicy && amount && Number(amount) > 0 && (
            <div className="rounded-lg border bg-blue-50 p-4 space-y-1 text-sm">
              <h3 className="font-semibold text-base">Balance Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-medium">Policy Premium:</span> ${selectedPolicy.premium}</div>
                <div><span className="font-medium">Claim Amount:</span> ${Number(amount).toFixed(2)}</div>
                <div><span className="font-medium">Total Deduction:</span> ${Math.min(Number(amount), selectedPolicy.premium).toFixed(2)}</div>
                <div className="text-green-700 font-semibold">
                  <span className="font-medium">Balance:</span> ${Math.max(0, selectedPolicy.premium - Number(amount)).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="w-full rounded border border-gray-300 p-2 text-sm min-h-[80px]"
              placeholder="Additional notes about the claim"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(`/${lang}/claims`)}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={!selectedPolicyId || !amount || Number(amount) <= 0 || saveMutation.isPending}>
          {saveMutation.isPending ? t("common.loading") : "Submit Claim"}
        </Button>
      </div>
    </form>
  );
}