const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    role: { type: String, enum: ['admin', 'staff', 'client'], default: 'admin' },
    officeEmail: { type: String, required: true, unique: true },
    officeMobile: { type: String, required: true, unique: true },
    designation: { type: String, required: true, },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    socketId: { type: String, default: null }
});
module.exports = mongoose.model('LoginSchema', LoginSchema);
