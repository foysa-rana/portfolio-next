import { NextResponse } from 'next/server';
import dbConnect from '@/db/connection';
import SocialMedia from '@/models/SocialMedia.model';

export async function GET() {
  try {
    await dbConnect();
    const socialMedia = await SocialMedia.find().sort('order');
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Failed to fetch social media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    // Get the highest order
    const lastSocialMedia = await SocialMedia.findOne().sort('-order');
    const newOrder = lastSocialMedia ? lastSocialMedia.order + 1 : 0;
    
    const socialMedia = await SocialMedia.create({ ...body, order: newOrder });
    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Failed to create social media:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create social media' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const socialMedias = await request.json();
    await dbConnect();
    
    // Use bulkWrite to update all social media in one operation
    await SocialMedia.bulkWrite(
      socialMedias.map((socialMedia: { _id: string; order: number }) => ({
        updateOne: {
          filter: { _id: socialMedia._id },
          update: { $set: { order: socialMedia.order } }
        }
      }))
    );
    
    const updatedSocialMedias = await SocialMedia.find().sort('order');
    return NextResponse.json(updatedSocialMedias);
  } catch (error) {
    console.error('Failed to update social media:', error);
    return NextResponse.json(
      { error: 'Failed to update social media' },
      { status: 500 }
    );
  }
} 