# Cheatsheets

## Getting Started

### 函数组件：    


```tsx
type AppProps = {
    message: string
};

const App = ({ message }: AppProps) => <div>{message}</div>;
```     

为什么不使用 `React.FC/React.FunctionComponent`：   

- 因为会有一个对于 `children` 的隐式定义，即便组件可能并不接受 `children`，这个没看懂
- 不支持泛型，个人感觉好像是支持的啊，不支持是不是因为文档太久了，当时不支持
- 对于使用组件作为命名空间的组件来说，会很奇怪   