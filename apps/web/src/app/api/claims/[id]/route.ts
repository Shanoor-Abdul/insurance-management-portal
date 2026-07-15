import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { ClaimModel } from "@insurance/lib/db/models";
import { serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await ClaimModel.findById(params.id).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}
