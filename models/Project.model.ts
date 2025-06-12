import { Schema, model, models } from 'mongoose'

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  link: {
    type: String,
    required: [true, 'Project link is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default models.Project || model('Project', projectSchema) 