// 块级作用域

// {
//   var a = 1;
//   let b = 2;
// }

// console.log(a);
// console.log(b);

// {
//   // 1
//   let a = 1;
//   {
//     // 2
//     console.log(a);
//     let b = 2;
//   }
//   console.log(b);
// } 

// {
//   // 1
//   var a = 1;
//   {
//     // 2
//     console.log(a);
//     var b = 2;
//   }
//   console.log(b);
// }

// if (true) {
//   var a = 1;
//   let b = 2;
// }

// console.log(a);
// console.log(b);

// -----------------------------------------------

// let只作用在当前块级作用域内

// for (let i = 0; i < 3; i++) {

// };
// console.log(i);

// for (var i = 0; i < 3; i++) {
//   console.log(i);
// };
// console.log(i);

// -----------------------------------------------

// 使用let或者const声明的变量 不能在被重新声明

// var dad = '我是爸爸!';
// console.log(dad);
// var dad = '我才是爸爸!';
// console.log(dad);

// let son = '我是儿子';
// let son = '我才是儿子';

// -----------------------------------------------

// let不存在`变量提升`
// console.log(dad);
// var dad = '我是爸爸!';

// console.log(dad);
// let dad = '我是爸爸!';

// -----------------------------------------------

// 暂存死区

// var monkey = '我是美猴王';
// {
//   console.log(monkey);
//   var monkey = '我觉得我还能再抢救一下!';
// }
// console.log(monkey);

// let monkey = '我是美猴王';
// {
//   console.log(monkey);
//   let monkey = '我觉得我还能再抢救一下!';
// }
// console.log(monkey);

// -----------------------------------------------

// q: 生成十个按钮 每个按点击的时候弹出1 - 10
// var i = 0;
// for (i = 1; i <= 10; i ++) {
//   (function(i) {
//     var btn = document.createElement('button');
//     btn.innerText = i;
//     btn.onclick = function() {
//       alert(i)
//     };
//     document.body.appendChild(btn);
//   })(i);
// }

for (let i = 1; i <= 10; i ++) {
  var btn = document.createElement('button');
  btn.innerText = i;
  btn.onclick = function() {
    alert(i)
  };
  document.body.appendChild(btn);
}
