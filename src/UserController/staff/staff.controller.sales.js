
const ClientRecruitmentSchema = require('../../Usersmodel/client/Client_Recruit_Schema');

// const createRecruitmentForm = async (req, res) => {
//   console.log(req.body)
//   console.log(req.files)
//   // res.json({body:req.files})
//   try {
//     // Validate that body exists and is an object
//     if (!req.body || typeof req.body !== 'object') {
//       return res.status(400).json({ success: false, error: 'Invalid form data' });
//     }

//     // Create new document in MongoDB
//     const newRecruitment = await ClientRecruitmentSchema.create(req.body);

//     // Respond with success
//     res.status(201).json({ success: true, data: newRecruitment });

//   } catch (error) {
//     console.error('Error saving recruitment form:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const getRecruitmentData = async (req, res) => {
  try {
    const respose = await ClientRecruitmentSchema.find({});
    res.status(201).json({ success: true, data: respose });

  } catch (error) {
    res.json({ success: false, error: error.message })

  }
}
// ---------------------------------------------------------------------------------

const { default: mongoose } = require('mongoose');
const staffSalesSchema = require('../../Usersmodel/client/staff.Sales.Schema');
const sendContactEmail = require('../../mail/allMail');



const getSalesData = async (req, res) => {
  console.log("getSalesData ", staffSalesSchema.collection.name);
  try {
    const respose = await staffSalesSchema.find();
    // console.log(respose)
    res.status(201).json({ success: true, data: respose });

  } catch (error) {
    res.status(404).json({ error: true, error: error.message })

  }
}

const getStages = async (req, res) => {
  try {

    const getstages = await staffSalesSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId("69bf456b0aecdf8a4bc05678") } },
      { $unwind: "$details" },
      { $unwind: "$details.stages.Stage1" },

      {
        $match: {
          "details.stages.Stage1._id": new mongoose.Types.ObjectId("69bf457b0aecdf8a4bc05679")
        }

      },
      {
        $replaceRoot: {
          newRoot: "$details.stages.Stage1"
        }
      }
      // { $project: { _id: 0, details: 1 } }
    ])

    res.status(201).json({ success: true, data: getstages });
  }
  catch (error) {
    res.status(404).json({ error: true, error: error.message })
  }
  // console.log("postSalesData ", req.body);
}


const updateMessageCallScheduleCancelDetails = async (req, res) => {
  let pushFields = {}
  let setFields = {}
  const { salesId, stageId, detailsId } = req.query;
  const {
    GeneralDetails,
    _id,
    GeneralDetails: { schedules = [] } = {},
    cancelDetails: { status, cancelNote } = {},
  } = req.body;
  console.log(GeneralDetails?.callDetails)
  try {

    const doc = await staffSalesSchema.findOne(
      { _id: salesId },
      { "details": 1 }
    )
    const stage = doc.details
      .find(d => d._id.equals(detailsId))
      ?.stages.Stage1
      .find(s => s._id.equals(stageId));

    const callDetailsEmpty = stage.GeneralDetails.callDetails.length === 0;
    const messageDetailsEmpty = stage.GeneralDetails.messageDetails.length === 0;
    const cancelDetailsEmpty = stage.cancelDetails.cancelNote === "";
    const schedulesEmpty = stage.schedules.length === 0;

    if (callDetailsEmpty) {

      pushFields["details.$[detail].stages.Stage1.$[stage].GeneralDetails.callDetails"] = GeneralDetails?.callDetails;
      pushFields["details.$[detail].stages.Stage1.$[stage].GeneralDetails.status"] = GeneralDetails?.status;
    } else {
      // update existing last element  or push new one
      setFields["details.$[detail].stages.Stage1.$[stage].GeneralDetails.callDetails.$[last]"] = GeneralDetails?.callDetails;
    }
    if (messageDetailsEmpty) {
      pushFields["details.$[details].stages.Stage1.$[stage]..GeneralDetails.callDetails"] = ""
    }
    let updteObject = {};

    if (Object.keys(pushFields).length > 0) updteObject.$push = pushFields;
    if (Object.keys(setFields).length > 0) updteObject.$set = setFields;
    try {
      const final_ = await staffSalesSchema.updateOne({ _id: new mongoose.Types.ObjectId(salesId) },
        updteObject,
        {
          arrayFilters: [
            { "detail._id": new mongoose.Types.ObjectId(detailsId) },
            { "stage._id": new mongoose.Types.ObjectId(stageId) }
          ]
        })
      res.status(200).json({ final_, success: true, message: "Update Completed " })
    } catch (err) {
      res.status(500).json({ error: true, message: err.message })
    }
    res.status(200).json({ updteObject, messageDetailsEmpty, cancelDetailsEmpty });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message || "Internal Server Error",
      error: err
    })
  }

};



const addBasicInfo = async (req, res) => {
  const {
    branch,
    province,
    salesManager,
    salesManagerId,
    date,
    time
  } = req.body;
  try {
    // await staffSalesSchema.validate({ province });
    const uniqueProvince = await staffSalesSchema.findOne({ province })
    if (uniqueProvince) {
      return res.status(400).json({ error: true, message: "Province already exists" });
    }
    const BI = await mongoose.connection.db.aggregate([
      {
        $documents: [
          {
            branch,
            province,
            salesManager,
            salesManagerId,
            date: new Date(date),
            time
          }
        ]
      },
      {
        $merge: {
          into: "salespipelines",
          whenMatched: "fail",
          whenNotMatched: "insert"
        }
      }
    ]).toArray();
    res.status(201).json({ message: "Basic Info added successfully", success: true, data: BI });
  } catch (error) {
    res.status(404).json({ error: true, message: error.message })
  }
}




const getDetailsData = async (req, res) => {
  // const id="289323ou98u3289u82"
  // const { _id } = req.query
  console.log('something is requesting', req.query)
  try {
    const fd = await staffSalesSchema.findById({ _id: "69e9f378d350a606553a29fa" }).select('details');
    if (fd) {
      res.status(200).json(fd)
    } else {
      res.status(400).json({ error: true, message: "Data not available" })
    }
  } catch (err) {
    res.status(404).json(err)

  }
}

const addMess_Call = async (req, res) => {
  const { MainID, DetailsID, Stage1 } = req.params;
  const { GeneralDetails, schedules, cancelDetails } = req.body;
  // console.log(GeneralDetails, schedules, cancelDetails)
  console.log("MainID , detailsID, stage1ID -->", req.body);

  try {
    // Validate IDs
    if (!MainID || !DetailsID || !Stage1) {
      return res.status(400).json({ error: true, message: "MainID, DetailsID, Stage1 are required in params" });
    }

    // Check data
    const hasCallDetails = GeneralDetails?.callDetails?.length > 0;
    const hasMessageDetails = GeneralDetails?.messageDetails?.length > 0;
    const hasSchedules = schedules?.length > 0;
    const hasCancelDetails = cancelDetails?.length > 0;

    // Nothing to push
    const hasAnyData = hasCallDetails || hasMessageDetails || hasSchedules || hasCancelDetails;
    if (!hasAnyData) {
      return res.status(400).json({ error: true, message: "No data provided to update" });
    }

    // Build single $push object
    const pushData = {
      ...(hasCallDetails && {
        "details.$[detail].stages.Stage1.$[stage].GeneralDetails.callDetails": {
          $each: GeneralDetails.callDetails
        }

      }),
      ...(hasMessageDetails && {
        "details.$[detail].stages.Stage1.$[stage].GeneralDetails.messageDetails": {
          $each: GeneralDetails.messageDetails
        }
      }),
      // ...(hasSchedules && {
      //   "details.$[detail].stages.Stage1.$[stage].schedules": {
      //     $each: schedules
      //   }
      // }),
      ...(hasCancelDetails && {
        "details.$[detail].stages.Stage1.$[stage].cancelDetails": {
          $each: cancelDetails
        }
      })

    };

    const validate = await staffSalesSchema.findOne({ _id: MainID }).select('details.stages.Stage1').lean();
    const isFilled = validate?.details?.[0]?.stages?.Stage1?.[0].isFilled;
    // console.log("Validate. details  →", typeof isFilled);
    if (isFilled) {
      return res.status(400).json({ warn: true, message: "Restric for Double entry." })
    }

    const result = await staffSalesSchema.updateOne(
      { _id: MainID },
      {
        $push: pushData,
        $set: {
          "details.$[detail].stages.Stage1.$[stage].isFilled": true
        }
      },
      {
        arrayFilters: [
          { "detail._id": new mongoose.Types.ObjectId(DetailsID) },
          { "stage._id": new mongoose.Types.ObjectId(Stage1) }
        ]
      }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: true, message: "Document not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: true, message: "Nothing was updated" });
    }

    res.status(200).json({
      success: true,
      message: "Stage1 updated successfully",
      data: result
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const AddScheduleOnly = async (req, res) => {
  const { MainID, Stage1, DetailsID } = req.params;
  const { scheduleDetails } = req.body;

  // console.log("query:", req.query);
  console.log("body:", req.body);

  if (!MainID || !DetailsID || !Stage1) {
    return res.status(400).json({
      error: true,
      message: "MainID, DetailsID and Stage1 are required",
    });
  }

  if (
    !mongoose.Types.ObjectId.isValid(MainID) ||
    !mongoose.Types.ObjectId.isValid(DetailsID) ||
    !mongoose.Types.ObjectId.isValid(Stage1)
  ) {
    return res.status(400).json({
      error: true,
      message: "Invalid MongoDB ID format",
    });
  }

  if (!Array.isArray(scheduleDetails) || scheduleDetails.length === 0) {
    return res.status(400).json({
      error: true,
      message: "scheduleDetails must be a non-empty array",
    });
  }

  try {
    const ScheduleOnly = await staffSalesSchema.updateOne(
      {
        _id: new mongoose.Types.ObjectId(MainID),
        "details._id": new mongoose.Types.ObjectId(DetailsID),
        "details.stages.Stage1._id": new mongoose.Types.ObjectId(Stage1),
      },
      {
        $push: {
          "details.$[detail].stages.Stage1.$[stage].schedules": {
            $each: scheduleDetails,
          },
        },
      },
      {
        arrayFilters: [
          { "detail._id": new mongoose.Types.ObjectId(DetailsID) },
          { "stage._id": new mongoose.Types.ObjectId(Stage1) },
        ],
      }
    );

    if (ScheduleOnly.matchedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Main, Details, or Stage not found",
      });
    }

    if (ScheduleOnly.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "Matched but schedule not modified",
        ScheduleOnly,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Schedule added successfully",
      ScheduleOnly,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const getScheduleOnly = async (req, res) => {
  const { MainID, DetailsID, Stage1 } = req.params;
  console.log('get only schedule', req.params)
  try {
    const sales = await staffSalesSchema.findOne(
      {
        _id: MainID,
        "details._id": DetailsID,
        "details.stages.Stage1._id": Stage1,
      },
      {
        details: 1,
      }
    ).lean();

    if (!sales) {
      return res.status(404).json({
        error: true,
        message: "Data not found",
      });
    }

    const detail = sales.details.find(
      (d) => d._id.toString() === DetailsID
    );

    const stage = detail?.stages?.Stage1?.find(
      (s) => s._id.toString() === Stage1
    );

    return res.status(200).json({
      success: true,
      message: "Schedule fetched successfully",
      data: {
        mainId: sales._id,
        detailsId: detail?._id,
        stageId: stage?._id,
        schedules: stage?.schedules || [],
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};

const addOrgLeadDetails = async (req, res) => {
  console.log(req.body)
  const { lead: {
    leadType,
    leadSource,
    leadChannel,
    campaignName,
    assignedSalesRep,
    ProductInterested,
    notes,
    branch,
    province,
    salesManager,
    note_comments
  },
    organization: {
      organizationName,
      organizationType,
      industyType,
      registrationNumber,
      vatPan,
      address,
      totalEmp_learners,
      totalEducator,
      contactPersonName,
      role,
      contactPersonNumber,
      contactPersonEmail
    }
  } = req.body
  console.log("addOrgDetails ", registrationNumber)
  try {
    const addOrg = await staffSalesSchema.create({
      organizationDetails: [{
        organizationName: organizationName,
        organizationType: organizationType,
        industyType: industyType,
        registrationNumber: registrationNumber,
        vatPan: vatPan,
        address: address,
        totalEmp_learners: totalEmp_learners,
        totalEducator: totalEducator,
        contactPersonName: contactPersonName,
        role: role,
        contactPersonNumber: contactPersonNumber,
        contactPersonEmail: contactPersonEmail
      }],
      leadDetails: [{
        leadType,
        leadSource,
        leadChannel,
        campaignName,
        ProductInterested,
        branch,
        province,
        salesManager,
        notes
      }],
      details: [
        {
          _id: new mongoose.Types.ObjectId(),
          stages: {
            Stage1: [
              {
                isFilled: false,
                currentStage: 1,
                nextStage: 2,
                active: true,
                stageName: "Lead Generation",
                _id: new mongoose.Types.ObjectId(),
              }
            ],
            Stage5: [
              {
                isFilled: false,
                currentStage: 5,
                nextStage: 6,
                active: true,
                stageName: "Contract",
                _id: new mongoose.Types.ObjectId(),

              }
            ]
          }
        }
      ]
    })
    res.status(201).json({ message: "Organization Details added successfully", success: true, data: addOrg });
  } catch (error) {
    res.status(404).json({ error: true, message: error.message })
  }
}

const getOnlyOrgDetails = async (req, res) => {
  const { _id } = req.query;
  console.log('get only org details', req.query);
  try {

    const orgDetails = await staffSalesSchema.findById(_id, { organizationDetails: 1 }).lean();
    if (!orgDetails) {
      return res.status(404).json({ error: true, message: "Organization details not found" });
    }
    res.status(200).json({ success: true, data: orgDetails });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
}

const updateOnlyOrgDetails = async (req, res) => {
  try {
    const { _id, organizationId } = req.params;
    const payload = req.body;
    console.log(payload?.organizationDetails);
    // console.log("Update Org Details Payload:", payload, _id, organizationId);
    if (!_id || !organizationId) {
      return res.status(400).json({
        error: true,
        message: "_id and organizationId are required",
      });
    }
    const requiredFields = [
      "address",
      "contactPersonEmail",
      "contactPersonName",
      "contactPersonNumber",
      "industyType",
      "organizationName",
      "organizationType",
      "registrationNumber",
      "role",
      "totalEducator",
      "totalEmp_learners",
      "vatPan",
      "_id",
      "createdAt",
      "updatedAt"

    ];

    const missingFields = requiredFields.filter(
      (field) => payload?.organizationDetails[field] === null || payload?.organizationDetails[field] === undefined || payload?.organizationDetails[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: true,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Extra validation for arrays
    if (!Array.isArray(payload?.organizationDetails?.industyType) || payload?.organizationDetails?.industyType.length === 0) {
      return res.status(400).json({
        error: true,
        message: "industyType must be a non-empty array",
      });
    }

    // Extra validation for numbers
    if (isNaN(payload?.organizationDetails?.totalEducator) || isNaN(payload?.organizationDetails?.totalEmp_learners)) {
      return res.status(400).json({
        error: true,
        message: "totalEducator and totalEmp_learners must be numbers",
      });
    }

    const updateResult = await staffSalesSchema.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(_id),
        "organizationDetails._id": new mongoose.Types.ObjectId(organizationId),
      }, {
      $set: {
        "organizationDetails.$.address": payload?.organizationDetails?.address,
        "organizationDetails.$.contactPersonEmail": payload?.organizationDetails?.contactPersonEmail,
        "organizationDetails.$.contactPersonName": payload?.organizationDetails?.contactPersonName,
        "organizationDetails.$.contactPersonNumber": payload?.organizationDetails?.contactPersonNumber,
        "organizationDetails.$.industyType": payload?.organizationDetails?.industyType,
        "organizationDetails.$.organizationName": payload?.organizationDetails?.organizationName,
        "organizationDetails.$.organizationType": payload?.organizationDetails?.organizationType,
        "organizationDetails.$.registrationNumber": payload?.organizationDetails?.registrationNumber,
        "organizationDetails.$.role": payload?.organizationDetails?.role,
        "organizationDetails.$.totalEducator": payload?.organizationDetails?.totalEducator,
        "organizationDetails.$.totalEmp_learners": payload?.organizationDetails?.totalEmp_learners,
        "organizationDetails.$.vatPan": payload?.organizationDetails?.vatPan,
      }
    }
    );

    if (!updateResult) {
      return res.status(404).json({
        error: true,
        message: "Organization details not found",
      });
    }

    res.status(200).json({
      success: true,
      // data: updateResult,
      message: "Organization details updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
};
const testEmail = async (req, res) => {
  try {
    const mailRes = await sendContactEmail("", "", "");
    res.status(200).json({ success: true, message: "Email sent successfully", data: mailRes });
  }
  catch (err) {
    console.log("Email sending failed:", err);
    res.status(400).json({ success: false, message: "Failed to send email" });
  }
}



module.exports = {
  getSalesData,
  getStages,
  addMess_Call,
  updateMessageCallScheduleCancelDetails,
  getDetailsData,
  addBasicInfo,
  addOrgLeadDetails,
  getSalesData,
  AddScheduleOnly,
  getRecruitmentData,
  getScheduleOnly,
  testEmail,
  getOnlyOrgDetails,
  updateOnlyOrgDetails
};

// 69e1e50021a886c29e61ea5d