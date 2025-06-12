import { Schema, model, models } from 'mongoose'

const socialMediaSchema = new Schema({
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default models.SocialMedia || model('SocialMedia', socialMediaSchema) 