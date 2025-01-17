import mongoose from 'mongoose';

const aboutMeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [2, 'Title must be at least 2 characters'],
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    minlength: [10, 'Bio must be at least 10 characters'],
  },
  pictureUrl: {
    type: String,
    default: '/placeholder.svg',
  },
}, {
  timestamps: true,
});

export const AboutMe = mongoose.models.AboutMe || mongoose.model('AboutMe', aboutMeSchema); 