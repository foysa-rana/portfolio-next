import { NextResponse } from 'next/server';
import connectDB from '@/db/connection';
import Skill from '@/models/Skill.model';

// GET all skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort('order');
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST new skill
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Get the highest order
    const lastSkill = await Skill.findOne().sort('-order');
    const newOrder = lastSkill ? lastSkill.order + 1 : 0;
    
    const skill = await Skill.create({ ...data, order: newOrder });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

// PUT update skills (for reordering)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const skills = await req.json();
    
    // Use bulkWrite to update all skills in one operation
    await Skill.bulkWrite(
      skills.map((skill: { _id: string; order: number }) => ({
        updateOne: {
          filter: { _id: skill._id },
          update: { $set: { order: skill.order } }
        }
      }))
    );
    
    // Fetch and return the updated skills
    const updatedSkills = await Skill.find().sort('order');
    return NextResponse.json(updatedSkills);
  } catch {
    return NextResponse.json({ error: 'Failed to update skills' }, { status: 500 });
  }
} 