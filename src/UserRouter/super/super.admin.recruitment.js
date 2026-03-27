const express = require('express')
const router = express.Router();
// const upload= require('../../middleware/upload.js');
const { upload } = require('../../middleware/upload.js');
// router.post('/', upload.array('files', 5), recruitmentForm);
router.post('/', () => {
    console.log("Running super admin")
});
router.get('/', (req, res) => {
    res.send("Running Super Admin Recruitment Route")
});
module.exports = router