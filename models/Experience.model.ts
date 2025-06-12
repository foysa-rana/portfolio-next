import { Schema, model, models } from 'mongoose'

interface ValidationProps {
  value: string
}

const ExperienceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v: string) {
        // Validate format: "Month Year" (e.g., "January 2024")
        return /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/.test(v)
      },
      message: (props: ValidationProps) => `${props.value} is not a valid date format! Use "Month Year" format (e.g., "January 2024")`
    }
  },
  endDate: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        // Allow empty string for present/current positions
        if (!v) return true
        // Validate format: "Month Year" (e.g., "January 2024")
        return /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/.test(v)
      },
      message: (props: ValidationProps) => `${props.value} is not a valid date format! Use "Month Year" format (e.g., "January 2024")`
    }
  },
  responsibilities: {
    type: [String],
    required: [true, 'At least one responsibility is required'],
  },
}, {
  timestamps: true
})

const Experience = models.Experience || model('Experience', ExperienceSchema)

export default Experience 