import { NextResponse } from 'next/server';
import dbConnect from "@/db/connection"
import Experience from "@/models/Experience.model"

export async function GET() {
  try {
    await dbConnect()
    const experiences = await Experience.find({}).sort({ startDate: -1 })
    return NextResponse.json(experiences)
  } catch {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await dbConnect()
    const experience = await Experience.create(body)
    return NextResponse.json(experience)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create experience";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}