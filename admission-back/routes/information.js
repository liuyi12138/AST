let express = require('express');
let informationDB = require('../models/information_db');
let router = express.Router();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });
let fs = require('fs');

router.post('/', urlencodedParser, async function (req, res, next) {
    // 获取req.body传来的信息，暂存在StudentData中
    let StudentData = {
        name: req.body.name,
        uid: req.body.uid,
        sex: req.body.sex,
        class: req.body.class,
        phone: req.body.phone,
        FirstExcept: req.body.FirstExcept,
        SecondExcept: req.body.SecondExcept,
        AdjustedOrNot: req.body.AdjustedOrNot,
        SelfIntroduction: req.body.SelfIntroduction,
    }
    // console.log(StudentData);

    // console.log(_validateStudentData(StudentData));
    // 函数验证StudentData是否符合规范，不符合则返回400（请求错误） 
    // 同是验证是否存在重复录入的情况
    if (!_validateStudentData(StudentData)) {
        res.status(400).send("Empty");
    } else {
        // console.log("ok");
        let collection = await informationDB.getCollection();
        collection.findOne({ name: StudentData.name }, function (err, data) {
            if (!data) {
                collection.insertOne({
                    name: StudentData.name,
                    uid: StudentData.uid,
                    sex: StudentData.sex,
                    class: StudentData.class,
                    phone: StudentData.phone,
                    FirstExcept: StudentData.FirstExcept,
                    SecondExcept: StudentData.SecondExcept,
                    AdjustedOrNot: StudentData.AdjustedOrNot,
                    SelfIntroduction: StudentData.SelfIntroduction,
                }, function () {
                    res.status(200).send("Success");
                });
            }
            else {
                console.log(data);
                if (req.body.uid == data.uid) {
                    collection.save({
                        "_id": data._id,
                        "name": StudentData.name,
                        "uid": StudentData.uid,
                        "sex": StudentData.sex,
                        "class": StudentData.class,
                        "phone": StudentData.phone,
                        "FirstExcept": StudentData.FirstExcept,
                        "SecondExcept": StudentData.SecondExcept,
                        "AdjustedOrNot": StudentData.AdjustedOrNot,
                        "SelfIntroduction": StudentData.SelfIntroduction,
                    }, function () {
                        res.status(200).send("Change Successfully");
                    });
                } else {
                    res.status(400).send("Dump");
                }
            }
        });
    };
});
// 验证StudentData是否格式合法，具有必须字段
function _validateStudentData(StudentData) {
    if (StudentData.name === undefined)
        return false;
    if (StudentData.uid === undefined)
        return false;
    if (StudentData.sex === undefined)
        return false;
    if (StudentData.class === undefined)
        return false;
    if (StudentData.phone === undefined)
        return false;
    if (StudentData.FirstExcept === undefined)
        return false;
    if (StudentData.SecondExcept === undefined)
        return false;
    if (StudentData.AdjustedOrNot === undefined)
        return false;
    if ((StudentData.SelfIntroduction === undefined) || ((StudentData.SelfIntroduction).length > 300))
        return false;
    return true;
}

module.exports = router;