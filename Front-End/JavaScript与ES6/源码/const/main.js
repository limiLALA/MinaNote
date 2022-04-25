// 声明常量

// const a = 1;
// var b = 2;
// let c;

// ------------------------------------------

// 常量声明后不能被修改

// const NAME = '小明';
// NAME = '小红';

// ------------------------------------------

// 常量为引用类型的时候 可以修改该引用类型

// const xiaoming = {
//   age: 14,
//   name: '小明'
// };
// console.log(xiaoming);
// xiaoming.age = 22;
// console.log(xiaoming);
// xiaoming = {};

//  

// ------------------------------------------

// q1: 怎么防止常量为引用类型的时候能被修改的情况

// Object.freeze()
// const xiaoming = {
//   age: 14,
//   name: '小明'
// };
// Object.freeze(xiaoming);
// console.log(xiaoming);
// xiaoming.age = 22;
// xiaoming.dd = 11;
// console.log(xiaoming);

// const ARR = [];
// Object.freeze(ARR);
// ARR.push(1);
// console.log(ARR);

// ------------------------------------------

// q2: es6之前怎么声明常量

// 1. 假装是常量
// var BASE_COLOR = '#ff0000';

// Object.defineProperty();

// var CST = {a: 1};

// Object.defineProperty(CST, 'a', {
//   writable: false
// });

// Object.seal(CST);


// 1. 遍历属性和方法
// 2. 修改遍历到的属性的描述
// 3. Object.seal()

Object.defineProperty(Object, 'freezePolyfill', {
  value: function(obj) {
    var i;
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        Object.defineProperty(obj, i, {
          writable: false
        });
      }
    }
    Object.seal(obj);
  }
});

const xiaoming = {
  age: 14,
  name: '小明',
  obj: {
    a: 1
  }
};

Object.freezePolyfill(xiaoming);













