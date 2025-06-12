import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: false,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema); 