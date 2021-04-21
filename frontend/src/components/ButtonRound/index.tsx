import React from 'react';
import {
  FiChevronRight,
  FiChevronLeft,
} from 'react-icons/all';
import './styles.scss';

type Props = {
  className?: string;
  direction: 'left'|'right';
  onClick: React.MouseEventHandler<HTMLDivElement>;
  size: number;
}

const ButtonRound = ({className, direction, onClick, size}:Props) => (
  <div
    className={`button-round ${className}`}
    onClick={onClick}
  >
    { direction === 'left' ?
      <FiChevronLeft size={size} /> :
      <FiChevronRight size={size} />
    }
  </div>
);

export default ButtonRound;
