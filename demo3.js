'use strict';
//连结数据库
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/test');
const Schema = mongoose.Schema;

const studentSchema = Schema({
    name: String,
    age: Number,
    xuexiao: {
        type: Schema.Types.ObjectId,
        ref: 'School' //这里要写你指向的数据库表名字
    }
});

const schoolSchemal = Schema({
    name: String,
});

const studentModel = mongoose.model('Student', studentSchema);
const schoolModel = mongoose.model('School', schoolSchemal);

studentModel
    .findOne({
        name: '小红'
    })
    .exec(function(err, student) {
        // 获取学校id
        const id = student.xuexiao;
        //学校查询
        schoolModel.findById(id, function(err, doc) {
            //赋值
            student.xuexiao = doc;
            console.log(student.xuexiao.name)
        });
    });
