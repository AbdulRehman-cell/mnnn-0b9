const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Contactsubmissions || mongoose.model('Contactsubmissions', contactSubmissionSchema);