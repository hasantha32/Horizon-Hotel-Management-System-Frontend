import React from 'react';
export const ChevronDown = ({
  color = 'currentColor',
  width = '14px',
  height = '10px',
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4 1.845a.91.91 0 0 0-1.613-.6L7.015 6.817l-4.771-5.57A.91.91 0 1 0 .866 2.428l5.457 6.378a.91.91 0 0 0 1.385 0l5.462-6.378a.91.91 0 0 0 .23-.583Z"
        fill={color}
      />
    </svg>
  );
};
