import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { StatementModel } from "@insurance/lib/db/models";
import { serializeArray, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const lob = searchParams.get("lob");

  const query: Record<string, unknown> = {};
  if (lob && lob !== "All") query.lob = lob;

  const docs = await StatementModel.find(query).sort({ dueDate: -1 }).limit(1000).lean().exec() as MongoDoc[];
  return NextResponse.json(serializeArray(docs));
}
