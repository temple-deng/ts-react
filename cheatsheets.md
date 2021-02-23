# Cheatsheets

<!-- TOC -->

- [Cheatsheets](#cheatsheets)
    - [Getting Started](#getting-started)
        - [函数组件：](#函数组件)
        - [Typing Component Props](#typing-component-props)
        - [Hooks](#hooks)
        - [Class Components](#class-components)
        - [Forms and Events](#forms-and-events)
        - [Context](#context)
        - [forwardRef/createRef](#forwardrefcreateref)
        - [Portals](#portals)
    - [Troubleshooting Handbook](#troubleshooting-handbook)

<!-- /TOC -->

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


### Typing Component Props

```js
interface AppProps {
    children1: JSX.Element;  // bad, doesn't account for arrays
    children2: JSX.Element | JSX.Element[];  // meh, doesn't accept strings
    children3: React.ReactChildren;  // despite the name, not at all an appropriate type; it is a utility
    children4: React.ReactChild[]; // better, accepts array children
    children: React.ReactNode; // best, accepts everything
    functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
    style?: React.CSSProperties; // to pass through style props
    onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
    props: Props & React.ComponentPropsWithoutRef<"button"> // to impersonate all the props of a button element and explicitly not forwarding its ref
    props: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // to impersonate all the props of MyButtonForwardedRef and explicitly forwarding its ref
}
```    

这里最后两个 props 那里没懂，这里讲下 React.ReactNode 和 JSX.Element 的区别。JSX.Element
是 `React.createElement` 返回值，不管最终组件渲染什么，这个函数总是返回一个对象，即 JSX.Element。
而 React.ReactNode 则是一个组件所有可能的返回值。    

### Hooks

先占个位。    

### Class Components

`React.Component` 是一个泛型。`React.Component<PropType, StateType>`。     

```tsx
type MyProps = {
    message: string;
};

type MyState = {
    count: number;
};

class App extends React.Component<MyProps, MyState> {
    state: MyState = {
        count: 0,
    };

    render() {
        return (
            <div>
                {this.props.message} {this.state.count}
            </div>
        );
    }
}
```     

### Forms and Events

```tsx
type State = {
    text: string;
};

type Props = {

};

class App extends React.Component<Props, State> {
    state = {
        text: "",
    };

    onChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            text: e.currentTarget.value,
        });
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.text} onChange={this.onChange} />
            </div>
        )
    }
}
```     

或者还有这种写法：    

```tsx
onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  this.setState({text: e.currentTarget.value});
}
```      

### Context

```tsx
import * as React from 'react';

interface AppContextInterface {
    name: string;
    author: string;
    url: string;
}

const AppCtx = React.createContext<AppContextInterface | null>(null);

// Provider in your app

const sampleAppContext: AppContextInterface = {
    name: 'Using React Context in a Typescript App',
    author: 'thehappybug',
    url: 'http://www.example.com'
};

export const App = () => (
    <AppCtx.Provider value={sampleAppContext}>...</AppCtx.Provider>
);

// Consume in your app

export const PostInfo = () => {
    const appContext = React.useContext(AppCtx);

    return (
        <div>
            Name: {appContext.name}, Author: {appContext.author}, Url: {" "}{appContext.url}
        </div>
    );
};
```     

### forwardRef/createRef

```tsx
import * as React from 'react';

class CssThemeProvider extends React.PureComponent<Props> {
    private rootRef = React.createRef<HTMLDivElement>();
    render() {
        return <div ref={this.rootRef}>{this.props.children}</div>
    }
}

type Props = {
    children: React.ReactNode;
    type: "submit" | "button";
};

export type Ref = HTMLButtonElement;
export const FancyButton = React.forwardRef<Ref, Props>((props, ref) => (
    <button ref={ref} className="MyClassName" type={props.type}>
        {props.children}
    </button>
));
```     

### Portals

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export class Modal extends React.Component {
    el: HTMLElement = document.createElement('div');

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}
```    

## Troubleshooting Handbook



