import { z } from 'zod';

export const aboutMeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  picture: z.custom<File | null | undefined>((value) => {
    if (value === undefined || value === null) return true;
    return value instanceof File;
  }, 'Picture must be a valid file').optional(),
});

export type AboutMeFormData = z.infer<typeof aboutMeSchema>; 