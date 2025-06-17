import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import Skill from '@/models/Skill.model';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single skill
export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const skill = await Skill.findById(params.id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

// PATCH update skill
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const data = await req.json();
    const skill = await Skill.findByIdAndUpdate(params.id, data, { new: true });
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const skill = await Skill.findByIdAndDelete(params.id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}