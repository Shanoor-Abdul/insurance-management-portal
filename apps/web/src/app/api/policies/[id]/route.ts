import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { PolicyModel } from "@insurance/lib/db/models";
import { serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await PolicyModel.findById(params.id).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await request.json();
  const doc = await PolicyModel.findByIdAndUpdate(params.id, body, { new: true }).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}
