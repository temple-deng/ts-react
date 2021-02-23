import * as ReactDOM from 'react-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.less';

function App() {
  const title = 'Hello1, World!';
  return (
    <div className="wrapper">
      <div>{title}</div>
      <Header name="temple" age={12} />
      <Footer name="hhhh" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
