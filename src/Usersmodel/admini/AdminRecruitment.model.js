// models/adminFormRecruitment.model.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: { type: String, trim: true },
    fileName: { type: String, trim: true }, // stored name on server (optional)
    mimeType: { type: String, trim: true },
    size: { type: Number, min: 0 },
      // if using cloud (S3/Cloudinary/etc.)
    path: { type: String, trim: true },       // if using local disk
  },
  { _id: false }
);

const adminFormRecruitmentSchema = new mongoose.Schema(
  {
    // ============ Personal ============
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    middleName: { type: String, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },

    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },

    nationality: {
      type: String,
      enum: ["Nepali", "Indian", "Other"],
      required: true,
      deafult:'Nepali'
    },

    citizenshipId: { type: String, trim: true, maxlength: 60 },

    profilePhoto: fileSchema,

    // ============ Contact ============
    officeEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      maxlength: 120,
    },
    personalEmail: { type: String, trim: true, lowercase: true, maxlength: 120 },

    officeMobile: { type: String, trim: true, maxlength: 20 },   // keep as string (leading 0, country code)
    personalMobile: { type: String, trim: true, maxlength: 20 },

    permanentAddress: { type: String, trim: true, maxlength: 250 },
    currentAddress: { type: String, trim: true, maxlength: 250 },

    // ============ Employment ============
    department: { type: String, trim: true, required: true, maxlength: 120 },
    designation: { type: String, trim: true, required: true, maxlength: 120 },
    jobRole: { type: String, trim: true, maxlength: 120 },

    employmentType: {
      type: String,
      enum: ["Permanent", "Contract", "Intern"],
      required: true,
    },

    dateOfJoining: { type: Date, required: true },

    employeeStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },

    workLocation: { type: String, trim: true, maxlength: 120 },
    reportingManager: { type: String, trim: true, maxlength: 120 },

    // ============ Docs ============
    docs: {
      resume: fileSchema,
      offerLetter: fileSchema,
      citizenDoc: fileSchema,
      qualification: fileSchema,
    },

    // ============ Audit ============
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Helpful unique indexes (optional)
adminFormRecruitmentSchema.index({ officeEmail: 1 }, { unique: true, sparse: true });
adminFormRecruitmentSchema.index({ citizenshipId: 1 }, { unique: true, sparse: true });

// Add unique indexes for phone numbers
adminFormRecruitmentSchema.index({ officeMobile: 1 }, { unique: true, sparse: true });
adminFormRecruitmentSchema.index({ personalMobile: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("AdminFormRecruitment", adminFormRecruitmentSchema);
