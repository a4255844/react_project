// 设置初始化状态
const initState = [{ name: 'zhangsan', age: 18 }, { name: 'lisi', age: 17 }];
// reducer的调用时机，初始化调用，每次修改状态调用，初始化调用自动更新状态，每次修改需要强制更新dom
export default function operCount(preState = initState, action) { //形参如果没传递参数，使用变量赋值，如果传递，使用传递的参数
  return preState;

}