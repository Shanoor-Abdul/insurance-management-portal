import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { UserModel } from "@insurance/lib/db/models";
import { serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await UserModel.findById(params.id).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await request.json();
  const doc = await UserModel.findByIdAndUpdate(params.id, body, { new: true }).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await UserModel.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
