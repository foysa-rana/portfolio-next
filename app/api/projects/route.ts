import { NextResponse } from 'next/server';
import dbConnect from '@/db/connection';
import Project from '@/models/Project.model';
import { uploadProjectImage } from '@/lib/uploadProjectImage';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().sort('-createdAt');
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const image = formData.get('image') as File;

    if (!title || !description || !link || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image
    const imageUrl = await uploadProjectImage(image);

    await dbConnect();
    
    // Get the highest order
    const lastProject = await Project.findOne().sort('-order');
    const newOrder = lastProject ? lastProject.order + 1 : 0;

    const project = await Project.create({
      title,
      description,
      link,
      image: imageUrl,
      tags,
      order: newOrder
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const projects = await request.json();
    
    // Use bulkWrite to update all projects in one operation
    await Project.bulkWrite(
      projects.map((project: { _id: string; order: number }) => ({
        updateOne: {
          filter: { _id: project._id },
          update: { $set: { order: project.order } }
        }
      }))
    );
    
    const updatedProjects = await Project.find().sort('order');
    return NextResponse.json(updatedProjects);
  } catch (error) {
    console.error('Failed to update projects order:', error);
    return NextResponse.json(
      { error: 'Failed to update projects order' },
      { status: 500 }
    );
  }
} 