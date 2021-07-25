const express = require("express");
const router = express.Router();
const { Meeting } = require("../models/Meeting");

//=================================
//             Meeting
//=================================

router.post("/", (req, res) => {
    // 받아온 정보들을 디비에 저장한다
    const meeting = new Meeting(req.body);

    meeting.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

router.post("/meetings", (req, res) => {
    try {
        let limit = req.body.limit ? parseInt(req.body.limit) : 20;
        let skip = req.body.skip ? parseInt(req.body.skip) : 0;
        //meeting collection 에 들어있는 모든 정보를 가져온다
        let term = req.body.searchTerm;

        let findArgs = {};
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                findArgs[key] = req.body.filters[key];
            }
        }
        if (term) {
            Meeting.find(findArgs)
                .find({ $text: { $search: term, $diacriticSensitive: true } })
                .populate("writer")
                .skip(skip)
                .limit(limit)
                .exec((err, meetingInfo) => {
                    if (err)
                        return res.status(400).json({ success: false, err });
                    return res.status(200).json({
                        success: true,
                        meetingInfo,
                        postSize: meetingInfo.length,
                    });
                });
        } else {
            Meeting.find(findArgs)
                .populate("writer")
                .skip(skip)
                .limit(limit)
                .exec((err, meetingInfo) => {
                    if (err)
                        return res.status(400).json({ success: false, err });
                    return res.status(200).json({
                        success: true,
                        meetingInfo,
                        postSize: meetingInfo.length,
                    });
                });
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;
