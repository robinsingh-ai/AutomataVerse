'use client';
import { useTheme } from '../../app/context/ThemeContext';


import React from 'react';
import { Circle, Group, Text } from 'react-konva';

const QuestionMark: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Group
      x={window.innerWidth / 2 - 25}
      y={window.innerHeight / 2 - 25}
    >
      <Circle
        radius={25}
        fill={theme === 'dark' ? '#333' : '#f0f0f0'}
        stroke={theme === 'dark' ? '#70DAC2' : '#70DAC2'}
        strokeWidth={2}
        opacity={0.9}
      />
      <Text
        text="?"
        fontSize={35}
        fontStyle="bold"
        fill={theme === 'dark' ? '#70DAC2' : '#70DAC2'}
        x={-10}
        y={-17}
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
};

export default QuestionMark; 