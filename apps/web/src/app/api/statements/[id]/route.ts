import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { StatementModel } from "@insurance/lib/db/models";
import { serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await StatementModel.findById(params.id).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}

interface StatementDoc {
  paidAmount?: number;
  pendingAmount?: number;
  status?: string;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await request.json();

  if (body.action === "pay") {
    const amount = Number(body.amount);
    const doc = await StatementModel.findById(params.id).lean().exec() as MongoDoc | null;
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const s = serialize(doc) as unknown as StatementDoc;
    const newPaid = (s.paidAmount || 0) + amount;
    const newPending = Math.max(0, (s.pendingAmount || 0) - amount);
    const newStatus: string = newPending === 0 ? "Paid" : (s.status || "Pending");

    const paymentEntry = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      method: "Online Payment"
    };

    await StatementModel.findByIdAndUpdate(params.id, {
      paidAmount: newPaid,
      pendingAmount: newPending,
      status: newStatus,
      $push: { paymentHistory: paymentEntry }
    });

    return NextResponse.json({
      success: true,
      transactionId: `TXN-${Date.now()}`,
      newStatus,
      paidAmount: newPaid,
      pendingAmount: newPending
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
