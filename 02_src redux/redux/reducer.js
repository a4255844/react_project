import { INCREMENT, DECREMENT } from './action_types.js';
// 设置初始化状态
const initState = 0;
// reducer的调用时机，初始化调用，每次修改状态调用，初始化调用自动更新状态，每次修改需要强制更新dom
export default function operCount(preState = initState, action) { //形参如果没传递参数，使用变量赋值，如果传递，使用传递的参数
    //在reducer中不可以修改传递过来的参数
    console.log('-----reducer调用了----', action);
    // 根据action中的type和data来决定应该如何操作状态
    let { type, data } = action
    // redux官方建议使用switch判断，如果符合条件返回newState，如果都不符合,返回preState
    let newState = null;
    switch (type) {
        case INCREMENT:
            newState = preState + data;
            console.log(newState);
            return newState;
        case DECREMENT:
            newState = preState - data;
            console.log(newState);
            return newState;
        default:
            return preState;
    }

}