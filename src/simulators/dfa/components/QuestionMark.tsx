'use client';

import React from 'react';
import { Image } from 'react-konva';
import { useTheme } from '../../../app/context/ThemeContext';

export interface QuestionMarkProps {
  image: HTMLImageElement;
}

const QuestionMark: React.FC<QuestionMarkProps> = ({ image }) => {
  const { theme } = useTheme();
  
  return (
    <Image
      image={image}
      x={window.innerWidth / 2 - 50}
      y={window.innerHeight / 2 - 50}
      width={100}
      height={100}
      opacity={0.7}
    />
  );
};

export default QuestionMark; 