import { NextResponse } from "next/server"
import dbConnect from "@/db/connection"
import Education from "@/models/Education.model"
import { Error } from "mongoose"

interface Props {
  params: { id: string }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = params
    await dbConnect()
    const body = await request.json()
    
    // Ensure descriptions array exists and is not empty
    if (!body.descriptions || !Array.isArray(body.descriptions) || body.descriptions.length === 0) {
      return NextResponse.json(
        { error: "At least one description is required" },
        { status: 400 }
      )
    }

    // Filter out empty descriptions
    body.descriptions = body.descriptions.filter((desc: string) => desc.trim().length > 0)
    
    if (body.descriptions.length === 0) {
      return NextResponse.json(
        { error: "At least one non-empty description is required" },
        { status: 400 }
      )
    }

    // Ensure endYear is never undefined
    body.endYear = body.endYear || ''
    
    const education = await Education.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to update education:', error)
    
    if (error instanceof Error.ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update education" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = params
    await dbConnect()
    
    const education = await Education.findByIdAndDelete(id)
    
    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to delete education:', error)
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    )
  }
} 