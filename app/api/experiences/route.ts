import { NextResponse } from "next/server"
import dbConnect from "@/db/connection"
import Experience from "@/models/Experience.model"

export async function GET() {
  try {
    await dbConnect()
    const experiences = await Experience.find({}).sort({ startDate: -1 })
    return NextResponse.json(experiences)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await dbConnect()
    const experience = await Experience.create(body)
    return NextResponse.json(experience)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create experience" },
      { status: 500 }
    )
  }
} 