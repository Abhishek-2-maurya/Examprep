const mongoose = require('mongoose');

const examineeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  qualification: { type: String, required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  status: { type: String, enum: ['active', 'inactive', 'delete'] },

}, {
  timestamps: true
});

module.exports = mongoose.model('Examinee', examineeSchema);
