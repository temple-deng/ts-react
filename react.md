# React

## 关于 context 的一些疑惑

当 Provider 的 value 属性变化时，订阅了这个 context 的后代节点会获得更新，当时这里就有个
问题，一般 value 变化的时候都是组件通过 setState 发生了变化，或者是组件的 props 变化从而
导致 value 发生了变换，不管是哪种，组件本身就会进行更新，除非订阅 context 的组件或其上层组件
跳过了更新，否则订阅 context 的组件本身就会进行更新吧，那这不就会出现两次更新？    

## 返回数组

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```     

