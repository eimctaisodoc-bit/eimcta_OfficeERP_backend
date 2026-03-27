const mongoose = require('mongoose');

// Follow-up history (common for all stages)
const FollowUpSchema = new mongoose.Schema({
  date: { type: Date },
  callType: { type: String },
  messages: { type: String },
  doneBy: { type: String },
  remarks: { type: String },
  reSchedule: { type: Date, default: null }
}, { _id: false });

// --- Stage 1: Lead Generation ---
const Stage1Schema = new mongoose.Schema({
  leadId: { type: String, required: true },
  stageName: { type: String, default: "Lead Generation" },
  active: { type: Boolean, default: true },
  currentStage: { type: Number, default: 1 },
  nextStage: { type: Number, default: 2 },
  next: { type: Boolean, default: false },
  isClose: { type: Boolean, default: false },
  stageEnteredAt: { type: Date },
  followUpRequired: { type: Boolean, default: false },
  followUpHistory: [FollowUpSchema],
  notification: [{ type: String }],
  status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { _id: false });

// --- Stage 2: Proposal & Commitment ---
const ProposalSharingSchema = new mongoose.Schema({
  sentVia: [{ type: String }], // ["whatsapp","email"]
  sentAt: { type: Date },
  remarks: { type: String }
}, { _id: false });

const ClientMeetingSchema = new mongoose.Schema({
  meetingType: { type: String }, // "virtual" or "physical"
  scheduledAt: { type: Date },
  conductedAt: { type: Date, default: null },
  attendees: [{ type: String }],
  remarks: { type: String }
}, { _id: false });

const InitialCommitmentSchema = new mongoose.Schema({
  commitmentStatus: { type: String }, // "pending","confirmed","rejected"
  remarks: { type: String }
}, { _id: false });

const Stage2Schema = new mongoose.Schema({
  leadId: { type: String, required: true },
  stageName: { type: String, default: "Proposal & Commitment" },
  active: { type: Boolean, default: false },
  currentStage: { type: Number, default: 2 },
  nextStage: { type: Number, default: 3 },
  next: { type: Boolean, default: false },
  isClose: { type: Boolean, default: false },
  stageEnteredAt: { type: Date },
  proposalSharing: ProposalSharingSchema,
  clientMeeting: ClientMeetingSchema,
  initialCommitment: InitialCommitmentSchema,
  followUpRequired: { type: Boolean, default: false },
  followUpHistory: [FollowUpSchema],
  notification: [{ type: String }],
  status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { _id: false });

// --- Stage 3: Closure / Contract Signed ---
const Stage3Schema = new mongoose.Schema({
  leadId: { type: String, required: true },
  stageName: { type: String, default: "Closure / Contract Signed" },
  active: { type: Boolean, default: false },
  currentStage: { type: Number, default: 3 },
  isClose: { type: Boolean, default: true },
  stageEnteredAt: { type: Date },
  contractSignedAt: { type: Date },
  signedBy: { type: String },
  remarks: { type: String },
  followUpRequired: { type: Boolean, default: false },
  followUpHistory: [FollowUpSchema],
  notification: [{ type: String }],
  status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { _id: false });

// --- Organization & Lead Info ---
const ContactPersonSchema = new mongoose.Schema({
  contactFullName: { type: String },
  contactRole: { type: String },
  contactNumber: { type: String },
  contactEmail: { type: String }
}, { _id: false });

const OrganizationSchema = new mongoose.Schema({
  organizationName: { type: String },
  registrationNumber: { type: String },
  vatPanNumber: { type: String },
  organizationAddress: { type: String },
  serviceStandards: { type: String },
  totalEmployees: { type: Number },
  educators: { type: Number },
  contactPerson: ContactPersonSchema,
  ExpectedBudget: { type: Number },
  fbProfiele: { type: String },
  linkedinProfile: { type: String },
  ytubeProfile: { type: String },
  isPayment: { type: Boolean },
  payment: { type: Number },
  paymentLeft: { type: Number }
}, { _id: false });

const LeadInfoSchema = new mongoose.Schema({
  leadId: { type: String, required: true },
  leadType: { type: String },
  leadSource: { type: String },
  leadChannel: { type: String },
  leadOwner: { type: String },
  leadTakenBy: { type: String },
  leadTakenAt: { type: Date },
  leadStatus: { type: String },
  isoStandards: [{ type: String }],
  isoServices: [{ type: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

// --- Pipeline Info ---
const PipelineInfoSchema = new mongoose.Schema({
  pipelineName: { type: String, required: true },
  organization: [OrganizationSchema],
  leadInfo: [LeadInfoSchema],
  stages: {
    Stage1: [Stage1Schema],
    Stage2: [Stage2Schema],
    Stage3: [Stage3Schema]
  }
}, { timestamps: true });

// --- Sale Wrapper ---
const SaleSchema = new mongoose.Schema({
  branch: { type: String },
  salesManager: { type: String },
  salesManagerId: { type: String },
  date: { type: Date },
  time: { type: String },
  details: [PipelineInfoSchema]
}, { timestamps: true });

module.exports = mongoose.model('salespipelines', SaleSchema);