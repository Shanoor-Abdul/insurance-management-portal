import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { ClaimModel } from "@insurance/lib/db/models";
import { serializeArray, type MongoDoc } from "@insurance/lib/db/serialize";

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
