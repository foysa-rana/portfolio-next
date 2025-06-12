import { Schema, model, models } from 'mongoose'

const contactSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
}, {
  timestamps: true
})

export default models.Contact || model('Contact', contactSchema) 