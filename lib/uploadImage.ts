import { writeFile } from 'fs/promises';
import path from 'path';

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const filename = `about-${uniqueSuffix}${path.extname(file.name)}`;
  const uploadPath = path.join(process.cwd(), 'public', 'about-images', filename);
  
  // Save the file
  await writeFile(uploadPath, buffer);
  
  // Return the public URL
  return `/about-images/${filename}`;
} 