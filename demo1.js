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


//创建学校
const school = schoolModel({
    name: '第一高中'
});

school.save(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    //创建了学生1
    const student = studentModel({
        name: '小红',
        age: 16,
        xuexiao: school._id //把学校的唯一id给绑定到学生身上。
    });
    student.save(function(err) {
        if (err) console.log(err);
    });

    //创建了学生2
    const student2 = studentModel({
        name: '小明',
        age: 16,
        xuexiao: school._id //把学校的唯一id给绑定到学生身上。
    });
    student2.save(function(err) {
        if (err) console.log(err);
    });
});
