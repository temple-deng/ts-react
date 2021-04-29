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

## hooks

再讨论 hooks 前，我们先思考一下，有哪些功能在 hooks 前必须是 class 组件才能做得，
而 functional 组件无法做得。    

- error boundary
- ref 不能绑定在 functional 组件上
- 不能 setState，组件更新前后没有数据能保存下来
- 没有生命周期，不能在特定的时间点，触发特定的行为
- 无法使用 context

貌似现在就这些。    

带有 cleanup 的 effect 执行的顺序是：    

- 函数主体
- cleanup
- effect    

在组件 unmount 的时候，则只有 cleanup 会执行。   

当有第二个参数，执行跳过渲染时，cleanup 和 effect 都会跳过。   

当 useState 的 setState 设置的值和当前的值相等时，那么 functional 组件就不会重新渲染。   

setState 的参数可以是一个函数。useState 的参数也可以是一个函数。   

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);

  useEffect(() => {
    prevCountRef.current = count;
  });

  const prevCount = prevCountRef.current;

  return (
    <div>
      <div>Now: {count}, before: {prevCount}</div>
      <button onClick={() => setCount(count + 1)}>Counter btn</button>
    </div>
  )
}
```    

## cheatsheets

- 函数式组件不要用 `React.FC` 等声明，让 TS 自己推断