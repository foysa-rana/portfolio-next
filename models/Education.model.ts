import { Schema, model, models } from 'mongoose'

interface ValidationProps {
  value: string
}

// Clear any existing model to prevent schema conflicts
if (models.Education) {
  delete models.Education
}

const EducationSchema = new Schema({
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  startYear: {
    type: String,
    required: [true, 'Start year is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        // Validate format: "Month Year" (e.g., "January 2024")
        return /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/.test(v)
      },
      message: (props: ValidationProps) => `${props.value} is not a valid date format! Use "Month Year" format (e.g., "January 2024")`
    }
  },
  endYear: {
    type: String,
    required: false,
    trim: true,
    default: '',
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
  descriptions: {
    type: [String],
    required: [true, 'At least one description is required'],
    validate: {
      validator: function(v: string[]) {
        return Array.isArray(v) && v.length > 0 && v.every(desc => desc.trim().length > 0)
      },
      message: 'At least one non-empty description is required'
    },
    default: []
  }
}, {
  timestamps: true,
  strict: true // This ensures only fields defined in the schema are saved
})

// Add a pre-save middleware to filter out empty descriptions
EducationSchema.pre('save', function(next) {
  if (this.descriptions) {
    this.descriptions = this.descriptions.filter(desc => desc.trim().length > 0)
  }
  next()
})

const Education = model('Education', EducationSchema)

export default Education 