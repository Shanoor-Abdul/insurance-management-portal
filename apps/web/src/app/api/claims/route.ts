import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { ClaimModel } from "@insurance/lib/db/models";
import { serialize, serializeArray, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const lob = searchParams.get("lob");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const query: Record<string, unknown> = {};
  if (lob && lob !== "All") query.lob = lob;
  if (status && status !== "All") query.status = status;
  if (search) {
    query.$or = [
      { claimNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } }
    ];
  }

  const docs = await ClaimModel.find(query).sort({ createdAt: -1 }).limit(1000).lean().exec() as MongoDoc[];
  return NextResponse.json(serializeArray(docs));
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const count = await ClaimModel.countDocuments();
  const claimNumber = `CLM-${2000 + count + 1}`;
  const doc = await ClaimModel.create({
    ...body,
    claimNumber,
    status: "Pending",
    submittedDate: new Date().toISOString().split("T")[0],
    timeline: [{ id: `t${Date.now()}`, date: new Date().toISOString().split("T")[0], title: "Submitted", description: "Claim submitted" }],
    documents: []
  });
  return NextResponse.json(serialize(doc.toObject() as MongoDoc), { status: 201 });
}
