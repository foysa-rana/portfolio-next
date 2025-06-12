import { NextResponse } from 'next/server';
import dbConnect from '@/db/connection';
import Contact from '@/models/Contact.model';

export async function GET() {
  try {
    await dbConnect();
    const contact = await Contact.findOne().sort({ createdAt: -1 });
    return NextResponse.json(contact || {});
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    const contact = await Contact.create(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Failed to create contact info:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create contact info' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    const contact = await Contact.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Failed to update contact info:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
} 