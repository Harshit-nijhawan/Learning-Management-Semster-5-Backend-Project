const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Check if model exists before compiling to prevent overwrite errors
const ContactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = ContactModel;