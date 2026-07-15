import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { UserModel } from "@insurance/lib/db/models";
import { serializeArray, serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET() {
  await connectDB();
  const docs = await UserModel.find().sort({ createdAt: -1 }).lean().exec() as MongoDoc[];
  return NextResponse.json(serializeArray(docs));
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const doc = await UserModel.create(body);
  return NextResponse.json(serialize(doc.toObject() as MongoDoc), { status: 201 });
}
