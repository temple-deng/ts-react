import * as ReactDOM from 'react-dom';
import React, {Suspense, useState} from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Clock from './components/Clock/Clock';
import Toggle from './components/Toggle/Toggle';
import NameForm from './components/NameForm/NameForm';
import ThemeText from './components/ThemeText/ThemeText';
import ThemeText2 from './components/ThemeText/ThemeText2';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Crash from './components/Crash/Crash';
import FocusInput from './components/FocusInput/FocusInput';
import RefForward from './components/RefForward/RefForward';
import Optimize from './components/Optimize/Optimize';
import ThemeContext from './contexts/ThemeContext';
import Modal, {Child} from './components/Modal/Modal';
import Effect from "./components/Effect/Effect";
import EffectWithClean from "./components/Effect/EffectWithClean";
import Counter from './components/Effect/Counter';
import './App.less';

const LazyComponent = React.lazy(
  () => import('./components/LazyComponent/LazyComponent')
);

function App() {
  const title = 'Hello1, World!';
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(1);
  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // setCount(count + 1);
  };

  const handleModalClick = () => {
    console.log('modal click')
  };


  console.log('app render');

  return (
    <>
      <div className="wrapper">
        <div>{title}</div>
        <Header name="temple" age={12} />
        <Clock />
        <Footer name="hhhh" />
        <Toggle />
        <NameForm />
        <Suspense fallback={<div>Loading</div>}>
          <LazyComponent />
        </Suspense>
      </div>
      <div onClick={handleClick}>1Click me2</div>
      <div>
        <ThemeContext.Provider value={theme}>
          <ThemeText />
          <ThemeText2 />
        </ThemeContext.Provider>
      </div>

      <div>
        <ErrorBoundary>
          <Crash />
        </ErrorBoundary>
      </div>

      <div>
        <FocusInput />
      </div>

      <div>
        <RefForward />
      </div>

      <div>
        <Optimize count={count} />
      </div>

      <div onClick={handleModalClick}>
        <div>123333</div>
        <Modal>
          <Child />
        </Modal>
      </div>

      <Effect />

      <EffectWithClean theme={theme} />

      <div style={{
        borderBottom: '1px solid #eee'
      }}></div>

      <Counter />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
