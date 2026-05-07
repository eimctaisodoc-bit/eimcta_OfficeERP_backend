const mongoose = require("mongoose");



// -----------------------------
// Stage 1 Sub Schemas
// -----------------------------
const CallDetailSchema = new mongoose.Schema(
  {
    by: { type: String, trim: true },
    type: {
      type: String,
      trim: true
    },
    callDuration: { type: Number, default: 0 },
    dateTime: { type: Date },
    note: { type: String, trim: true },
  },
  { _id: true }
);

const MessageDetailSchema = new mongoose.Schema(
  {
    by: { type: String, trim: true },
    type: {
      type: String,
      trim: true
    },
    dateTime: { type: Date },
    note: { type: String, trim: true },
  },
  { _id: true }
);

const ScheduleSchema = new mongoose.Schema(
  {
    fromDate: { type: Date },
    toDate: { type: Date },
    scheduleNote: { type: String, trim: true },
    by: { type: String, trim: true },
    status: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const Stage1Schema = new mongoose.Schema(
  {
    leadId: { type: String },
    isFilled: { type: Boolean, default: false },
    currentStage: { type: Number, default: 1 },
    nextStage: { type: Number, default: 2 },
    active: { type: Boolean, default: true },
    GeneralDetails: {
      status: {
        type: String,
      },
      callDetails: {
        type: [CallDetailSchema],
        default: [],
      },
      messageDetails: {
        type: [MessageDetailSchema],
        default: [],
      },

    },

    notification: {
      type: [String],
      default: [],
    },


    cancelDetails: [{
      status: {
        type: String
      },

      cancelNote: {
        type: String,
        trim: true,
        default: "",
      },
    }],

    schedules: { type: [ScheduleSchema], default: [] }
  },
  { _id: true }
);
const Stage5Schema = new mongoose.Schema(
  {
    leadInfo: {
      type: Array,
      default: [],
    },

    organizationName: {
      type: String,
      trim: true,
      default: "",
    },

    organizationType: {
      type: String,
      trim: true,
      default: "",
    },

    industryType: {
      type: [String],
      default: [],
    },

    registrationNumber: {
      type: String,
      trim: true,
      default: "",
    },

    vatPan: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    totalEmployeesOrLearners: {
      type: Number,
      default: null,
    },

    totalEducators: {
      type: Number,
      default: null,
    },

    contactPersonName: {
      type: String,
      trim: true,
      default: "",
    },

    contactPersonRole: {
      type: String,
      trim: true,
      default: "",
    },

    contactPersonNumber: {
      type: String,
      trim: true,
      default: "",
    },

    contactPersonEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    discounted: {
      type: Number,
      default: 0,
    },

    installments: {
      type: Array,
      default: [],
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const OrganizationDetailsSchema = new mongoose.Schema(
  {
    organizationName: { type: String },
    organizationType: { type: String },
    industyType: { type: [String] },
    registrationNumber: { type: String },
    vatPan: { type: String },
    address: { type: String },
    totalEmp_learners: { type: Number },
    totalEducator: { type: Number },
    contactPersonName: { type: String },
    role: { type: [String] },
    contactPersonNumber: { type: String },
    contactPersonEmail: { type: String },
  }, { _id: true, timestamps: true }
);
const LeadDetailsSchema = new mongoose.Schema({
  leadType: { type: String },
  leadSource: { type: String },
  leadChannel: { type: String },
  campaignName: { type: String },
  ProductInterested: { type: [String] },
  branch: { type: String, },
  province: { type: Number },
  salesManager: { type: String },
  salesManagerId: { type: String },
  note_comments: { type: String },
}, { _id: true, timestamps: true });

const PipelineInfoSchema = new mongoose.Schema(
  {
    pipelineName: { type: String },
    stages: {
      Stage1: {
        type: [Stage1Schema],
        default: [],
        currentStage: 1, nextStage: 2, active: true,
      },
      Stage2: {
        type: [Stage1Schema],
        default: [],
        currentStage: 2, nextStage: 3, active: false
      },
      Stage3: {
        type: [Stage1Schema],
        default: [],
        currentStage: 3, nextStage: 4, active: false
      },
      Stage4: {
        type: [Stage1Schema],
        default: [],
        currentStage: 4, nextStage: 5, active: false
      },
      
      Stage5: {
        type: [Stage5Schema],
        default: [],
        currentStage: 5, nextStage: 6, active: false
      },


    },

  },
  { _id: true, timestamps: true },
);

// -----------------------------
// Main Sale Schema
// -----------------------------
const SaleSchema = new mongoose.Schema(
  {
    organizationDetails: [OrganizationDetailsSchema],
    leadDetails: [LeadDetailsSchema],
    details: [PipelineInfoSchema],

    handleBranch: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("salespipelines", SaleSchema);
