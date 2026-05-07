const express = require('express');
const { getSalesData, getStages, testEmail,getOnlyOrgDetails,updateOnlyOrgDetails,AddScheduleOnly,getScheduleOnly, updateMessageCallScheduleCancelDetails, getDetailsData, addOrgLeadDetails, addBasicInfo, addMess_Call } = require('../../UserController/staff/staff.controller.sales');
const router = express.Router()

router.get('/getSalesData', getSalesData);

router.get('/getStages', getStages);

router.get('/getdetails', getDetailsData);

router.put('/update_mcsc', updateMessageCallScheduleCancelDetails);

router.post('/addbasicInfo', addBasicInfo);

router.patch('/add_mcsc/:MainID/:DetailsID/:Stage1', addMess_Call);

router.patch('/add_scheduleonly/:MainID/:DetailsID/:Stage1', AddScheduleOnly);
// router.patch('/add_scheduleonly/', AddScheduleOnly);

router.get("/get_scheduleonly/:MainID/:DetailsID/:Stage1", getScheduleOnly);

router.post('/orgdetails', addOrgLeadDetails);
router.get('/test', testEmail);

router.get('/orgdetails', getOnlyOrgDetails);

router.patch('/update_org_details_only/:_id/:organizationId', updateOnlyOrgDetails);

// router.patch('/update_org_details_only', updateOnlyOrgDetails);

// http://localhost:5000/staff/sales/orgdetails?_id=69e9f378d350a606553a29fa

// router.post('/leadDetails', addLeadDetails);


module.exports = router;
