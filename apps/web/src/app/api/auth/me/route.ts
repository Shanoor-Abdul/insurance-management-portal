import { NextResponse } from "next/server";
import { connectDB } from "@insurance/lib/db/connect";
import { UserModel } from "@insurance/lib/db/models";
import { serialize, type MongoDoc } from "@insurance/lib/db/serialize";

export async function GET() {
  await connectDB();
  const doc = await UserModel.findOne().sort({ createdAt: 1 }).lean().exec() as MongoDoc | null;
  if (!doc) return NextResponse.json({ error: "No user found" }, { status: 404 });
  return NextResponse.json(serialize(doc));
}
