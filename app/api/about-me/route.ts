import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import { AboutMe } from '@/models/AboutMe.model';
import { aboutMeSchema } from '@/schemas/aboutMe.schema';
import { uploadImage } from '@/lib/uploadImage';

export async function GET() {
  try {
    await connectDB();
    const aboutMe = await AboutMe.findOne().sort({ createdAt: -1 });
    return NextResponse.json(aboutMe || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about me data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const picture = formData.get('picture') as File | null;
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;

    // Validate the data
    const validatedData = aboutMeSchema.parse({
      name,
      title,
      bio,
      picture
    });

    // Handle image upload if present
    let pictureUrl = '/placeholder.svg';
    if (picture) {
      pictureUrl = await uploadImage(picture);
    }

    await connectDB();
    const aboutMe = await AboutMe.create({
      ...validatedData,
      pictureUrl
    });
    
    return NextResponse.json(aboutMe, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create about me data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const picture = formData.get('picture') as File | null;
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;

    // Validate the data
    const validatedData = aboutMeSchema.parse({
      name,
      title,
      bio,
      picture
    });

    // Handle image upload if present
    let pictureUrl;
    if (picture) {
      pictureUrl = await uploadImage(picture);
    }

    await connectDB();
    const aboutMe = await AboutMe.findOneAndUpdate(
      {},
      {
        ...validatedData,
        ...(pictureUrl && { pictureUrl })
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(aboutMe);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update about me data' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await AboutMe.deleteOne({});
    return NextResponse.json({ message: 'About me data deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete about me data' },
      { status: 500 }
    );
  }
} 