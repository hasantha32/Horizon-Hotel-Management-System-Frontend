import * as React from 'react';

export const Chevron = ({
  color = 'currentColor',
  width = '12',
  height = '7',
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.665.542a.791.791 0 00-.561.232L.232 5.646a.793.793 0 101.122 1.122l4.31-4.31 4.311 4.31a.793.793 0 101.122-1.123L6.226.774a.791.791 0 00-.561-.232z"
        fill={color}
      />
    </svg>
  );
};
