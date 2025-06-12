import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadProjectImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `project-${uniqueSuffix}${path.extname(file.name)}`;
  
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'project-images');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch {
    // Ignore error if directory already exists
  }
  
  const uploadPath = path.join(uploadDir, filename);
  
  // Save the file
  await writeFile(uploadPath, buffer);
  
  // Return the public URL
  return `/project-images/${filename}`;
} 