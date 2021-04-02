import {Component} from "react";
import {createPortal} from "react-dom";

const modalRoot = document.getElementById('modal-root');

type ModalProps = {
  children: React.ReactNode,
};

class Modal extends Component<ModalProps> {
  el = document.createElement('div');

  componentDidMount() {
    if (modalRoot) {
      modalRoot.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    if (modalRoot) {
      modalRoot.removeChild(this.el);
    }
  }

  render() {
    return createPortal(
      this.props.children,
      this.el
    );
  }
}

export function Child() {
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

export default Modal;
