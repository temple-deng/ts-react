/**
 * @file
 */

import {Component} from 'react';

interface ClassProps {
  name: string;
  gender?: string;
}

class Footer extends Component<ClassProps> {
  constructor(props: ClassProps) {
    super(props);
  }

  render(): JSX.Element {
    const {name, gender} = this.props;
    return (
      <>
        <div>name: {name}</div>
        {gender && <div>gender: {gender}</div>}
      </>
    );
  }
}

export default Footer;
