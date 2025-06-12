import { NextResponse } from 'next/server';
import dbConnect from '@/db/connection';
import SocialMedia from '@/models/SocialMedia.model';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const socialMedia = await SocialMedia.findByIdAndDelete(params.id);
    
    if (!socialMedia) {
      return NextResponse.json(
        { error: 'Social media not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Failed to delete social media:', error);
    return NextResponse.json(
      { error: 'Failed to delete social media' },
      { status: 500 }
    );
  }
} 