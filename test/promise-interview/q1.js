// 链接：https://juejin.cn/post/6945319439772434469

const Promise = require('../../src/promise/promise-comment')

Promise.resolve().then(() => { // P1-then1 P1-then1-cb
    console.log(0);
    return Promise.resolve(4);// P3
}).then((res) => { // P1-then2 P1-then2-cb
    console.log(res)
})

Promise.resolve().then(() => { // P2-then1 P2-then1-cb
    console.log(1);
}).then(() => { // P2-then2 P2-then2-cb
    console.log(2);
}).then(() => { // P2-then3 P2-then3-cb
    console.log(3); 
}).then(() => { // P2-then4 P2-then4-cb
    console.log(5);
}).then(() => { // P2-then5 P2-then5-cb
    console.log(6);
})

/**
 * 第一轮 代码整体执行完之后
 * EventLoop(EL) 中：
 *  P1-then1-cb
    P2-then1-cb

   P1-then1 onResolvedCallback 中
    P1-then2-cb

   P2-then1 onResolvedCallback 中
    P2-then2-cb
   P2-then2 onResolvedCallback 中
    P2-then3-cb
   P2-then3 onResolvedCallback 中
    P2-then4-cb
   P2-then4 onResolvedCallback 中
    P2-then5-cb

  EL 执行 P1-then1-cb => 0，返回 P3
    EL中：
        P3-then
  EL 执行 P2-then1-cb => 1
    EL中：
        P3-then // 关键是这里 P3-then 的执行是异步的，计入了一次EL
        P2-then2-cb
  EL 执行 P3-then
    EL中：
        P1-then1 的 resolve
  EL 执行 P2-then2-cb => 2
    EL中：
        P1-then1 的 resolve
        P2-then3-cb
  EL 执行 P1-then1 的 resolve
    EL中：
        P1-then2-cb
  EL 执行 P2-then3-cb => 3
    EL中：
        P1-then2-cb
        P2-then4-cb
  EL 执行 P1-then2-cb => 4
    EL中：
        P1-then2 的 默认 onResolved
  EL 执行  P2-then4-cb => 5
    EL中：
        P1-then2 的 默认 onResolved
        P2-then5-cb
  EL 执行 P1-then2 的 默认 onResolved
    EL中：
  EL 执行 P2-then5-cb => 6
    EL中：
        P2-then5 的 默认 onResolved
  EL 执行 P2-then5 的 默认 onResolved
 */


