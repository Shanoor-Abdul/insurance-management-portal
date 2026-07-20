"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getStatementById, processPayment, useAppStore } from "@insurance/lib";
import { Loader, Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from "@insurance/ui";

export default function StatementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addNotification = useAppStore((s) => s.addNotification);

  const { data: statement, isLoading } = useQuery({
    queryKey: ["statement", id],
    queryFn: () => getStatementById(id)
  });

  const [payAmount, setPayAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const payMutation = useMutation({
    mutationFn: (amount: number) => processPayment(id, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["statement", id] });
      queryClient.invalidateQueries({ queryKey: ["statements"] });
      setShowPaymentForm(false);
      setPayAmount("");
      addNotification({
        id: `pay-${Date.now()}`,
        title: "Payment Successful",
        message: `Transaction ${data.transactionId} completed successfully!`,
        type: "success",
        read: false,
        createdAt: new Date().toISOString()
      });
    },
    onError: () => {
      addNotification({
        id: `pay-err-${Date.now()}`,
        title: "Payment Failed",
        message: "The payment could not be processed. Please try again.",
        type: "error",
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  const handlePay = () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;
    if (statement && amount > (statement.pendingAmount || 0)) {
      addNotification({
        id: `pay-err-${Date.now()}`,
        title: "Invalid Amount",
        message: `Amount cannot exceed pending amount of $${statement.pendingAmount}`,
        type: "warning",
        read: false,
        createdAt: new Date().toISOString()
      });
      return;
    }
    payMutation.mutate(amount);
  };

  if (isLoading) return <Loader />;
  if (!statement) return <div className="p-8 text-center text-gray-500">{t("common.noResults")}</div>;

  const isOverdue = statement.status === "Overdue";
  const canPay = statement.pendingAmount > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("statements.title")} - {statement.policyNumber}</h1>
        {canPay && !showPaymentForm && (
          <Button onClick={() => setShowPaymentForm(true)}>
            {isOverdue ? "Pay Overdue Now" : "Make Payment"}
          </Button>
        )}
      </div>

      {isOverdue && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          ⚠ This statement is overdue! Pending amount: ${statement.pendingAmount.toLocaleString()}. Please make payment immediately to avoid further penalties.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("statements.table.customer")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {statement.customer.name}</p>
            <p><strong>Email:</strong> {statement.customer.email}</p>
            <p><strong>Mobile:</strong> {statement.customer.mobile}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payment Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Premium</span>
              <span className="font-semibold">${statement.premium.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paid Amount</span>
              <span className="font-semibold text-green-700">${statement.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Amount</span>
              <span className={`font-semibold ${isOverdue ? "text-red-700" : "text-yellow-700"}`}>
                ${statement.pendingAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date</span>
              <span className="font-medium">{statement.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant={statement.status === "Paid" ? "success" : statement.status === "Overdue" ? "danger" : "warning"}>
                {statement.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      {showPaymentForm && canPay && (
        <Card>
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Total pending: <strong>${statement.pendingAmount.toLocaleString()}</strong>
              {isOverdue && <span className="ml-2 text-red-600">(Overdue)</span>}
            </p>
            <div className="flex max-w-sm items-end gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-gray-700">Payment Amount ($)</label>
                <Input
                  type="number"
                  min="0"
                  max={statement.pendingAmount}
                  step="0.01"
                  placeholder="Enter amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
              </div>
              <Button
                onClick={handlePay}
                disabled={!payAmount || Number(payAmount) <= 0 || payMutation.isPending}
              >
                {payMutation.isPending ? t("common.loading") : `Pay $${Number(payAmount || 0).toFixed(2)}`}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPayAmount(String(statement.pendingAmount))}>
                Pay Full Amount
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPaymentForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {payMutation.isSuccess && (
        <Card>
          <CardHeader><CardTitle className="text-green-700">✅ Payment Successful</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><strong>Transaction ID:</strong> {payMutation.data.transactionId}</p>
            <p><strong>Amount Paid:</strong> ${payAmount}</p>
            <p><strong>New Status:</strong> <Badge variant={payMutation.data.newStatus === "Paid" ? "success" : "warning"}>{payMutation.data.newStatus}</Badge></p>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {statement.paymentHistory && statement.paymentHistory.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("policies.details.paymentHistory")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statement.paymentHistory.map((payment: { id: string; date: string; amount: number; method: string }) => (
                <div key={payment.id} className="flex items-center justify-between rounded border p-3 text-sm">
                  <div>
                    <span className="font-medium">${payment.amount.toLocaleString()}</span>
                    <span className="ml-2 text-gray-500">- {payment.method}</span>
                  </div>
                  <div className="text-gray-400">
                    {payment.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Schedule */}
      {statement.paymentSchedule && statement.paymentSchedule.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Payment Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statement.paymentSchedule.map((item: { id: string; dueDate: string; amount: number; status: string }) => (
                <div key={item.id} className="flex items-center justify-between rounded border p-3 text-sm">
                  <div>
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                    <span className="ml-2 text-gray-500">due {item.dueDate}</span>
                  </div>
                  <Badge variant={item.status === "Paid" ? "success" : item.status === "Overdue" ? "danger" : "warning"}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}