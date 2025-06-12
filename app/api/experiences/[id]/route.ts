import { NextResponse } from "next/server"
import dbConnect from "@/db/connection"
import Experience from "@/models/Experience.model"

interface Props {
  params: { id: string }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = params
    const body = await request.json()
    await dbConnect()
    
    const experience = await Experience.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = params
    await dbConnect()
    const experience = await Experience.findByIdAndDelete(id)
    
    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    )
  }
} 