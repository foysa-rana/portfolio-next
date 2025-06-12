import { NextResponse } from "next/server"
import dbConnect from "@/db/connection"
import Education from "@/models/Education.model"
import { Error } from "mongoose"

export async function GET() {
  try {
    await dbConnect()
    const educations = await Education.find({}).sort({ startYear: -1 })
    return NextResponse.json(educations)
  } catch (error) {
    console.error('Failed to fetch educations:', error)
    return NextResponse.json(
      { error: "Failed to fetch educations" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    // Create a new education document with only the fields defined in the schema
    const educationData = {
      degree: body.degree,
      institution: body.institution,
      location: body.location,
      startYear: body.startYear,
      endYear: body.endYear,
      descriptions: body.descriptions
    }

    const education = await Education.create(educationData)
    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to create education:', error)
    
    if (error instanceof Error.ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    )
  }
} 