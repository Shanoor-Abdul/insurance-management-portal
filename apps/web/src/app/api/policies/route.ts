import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { PolicyModel } from "@insurance/lib/db/models";
import { serializeArray, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const lob = searchParams.get("lob");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const query: Record<string, unknown> = {};
  if (lob && lob !== "All") query.lob = lob;
  if (status && status !== "All") query.status = status;
  if (startDate) query.startDate = { $gte: startDate };
  if (endDate) query.endDate = { $lte: endDate };
  if (search) {
    query.$or = [
      { policyNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } }
    ];
  }

  const docs = await PolicyModel.find(query).sort({ createdAt: -1 }).limit(1000).lean().exec() as MongoDoc[];
  return NextResponse.json(serializeArray(docs));
}
