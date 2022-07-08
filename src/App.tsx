import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

import Image from './picture.png';
import './styles.css';

type AppProsp = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

export const App = ({
  className,
}: AppProsp): JSX.Element => {
  return (
    <>
      <p className={className}>Hello, World!!</p>
      <img src={Image} alt="" />
    </>
  );
};
