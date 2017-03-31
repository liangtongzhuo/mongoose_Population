# mongoose_Population
用于总结mongoose Population的关系使用

使用mongoos来实现表与表之间的关系，但是官网写的云里雾里的看的我贼求费劲，本人自我总结的记录如下，如有不对，请联系我或留言。

github有代码: https://github.com/hi363138911/mongoose_Population

 - ## 本次内容有：
  - 连表的数据关联
  - 连表的数据查询
  - 连表的本质
  - 官网的奇葩例子，分析。

---
## 连表的数据关联
首先我们以学生（student）和学校（school)来设计一对多

### 学生表：student
_id | name | age | xuexiao(指向shool表，存储的id)
----|----|----|----
58ddd5dc6216a905ce973de5 | 小红  | 16 | 58ddd5db6216a905ce973de4
58ddd9566cb3240721c49986 | 小明  | 16 | 58ddd5db6216a905ce973de4


### 学校表：school
_id | name | 
----|----|
58ddd5db6216a905ce973de4 | 第一中学 

运行如下代码 demo1.js，

```
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


```

### 连表数据查询
- 根据学生获取学校名字
  demo2.js 代码如下

```

studentModel
    .findOne({
        name: '小红'
    })
    .exec(function(err, student) {
        console.log('id: ', student.xuexiao, 'name: ', student.xuexiao.name);
        //id:  58ddd5db6216a905ce973de4 name:  undefined
        //这里打印只有id，并没有属性
    });

studentModel
    .findOne({
        name: '小红'
    })
    .populate('xuexiao') //加上这句话也就有了属性值, 
    .exec(function(err, student) {
        console.log('id: ', student.xuexiao, 'name: ', student.xuexiao.name);
        //id:  { _id: 58ddd5db6216a905ce973de4, name: '第一高中', __v: 0 } name:  第一高中
    });

```
### 到这里你就发现重要的是 populate('xuexiao') 是干嘛的？
我们不加populate，查询出来的是为_id，然后我们根据这个_id去查询相应的表，就可以得到相应的结果，这也就是连表的本质，我们模仿一下
demo3.js 

```

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
```

### 另外吐槽一下官网例子
```

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var personSchema = Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

```
1. _id可以Number，这样你就没有了默认_id，另外_id是默认索引，_id也是不可重复的.（ObjectId，Number，String，和Buffer 类型都是允许的，95%用的都是ObjectId）
2.  fans属性可以为数组，这个属性里可以存多个_id。我不太建议在这个数组里存大于100个id。但是具体问题具体分析。

我的github有代码样列: https://github.com/hi363138911/mongoose_Population
官网的例子：一开始理解真是有点郁闷。
官网：http://mongoosejs.com/docs/populate.html