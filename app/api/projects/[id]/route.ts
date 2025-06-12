import { NextResponse } from 'next/server';
import dbConnect from '@/db/connection';
import Project from '@/models/Project.model';
import { uploadProjectImage } from '@/lib/uploadProjectImage';

interface Props {
  params: { id: string }
}

interface UpdateData {
  title: string;
  description: string;
  link: string;
  tags: string[];
  image?: string;
}

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = params;
    await dbConnect();
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const image = formData.get('image') as File | null;

    if (!title || !description || !link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: UpdateData = {
      title,
      description,
      link,
      tags
    };

    // Only update image if a new one is provided
    if (image instanceof File) {
      const imageUrl = await uploadProjectImage(image);
      updateData.image = imageUrl;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = params;
    await dbConnect();
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 