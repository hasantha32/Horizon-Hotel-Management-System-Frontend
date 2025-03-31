import { useIsRTL } from '@/utils/locals';
import React from 'react';
import ReactSelect, { Props } from 'react-select';
import { selectStyles } from './select.styles';

export type Ref = any;

export const Select = React.forwardRef<Ref, Props>((props, ref) => {
  const { isRTL } = useIsRTL();
  return (
    <ReactSelect
      ref={ref}
      styles={selectStyles}
      isRtl={isRTL}
      {...props}
    />
  );
});

Select.displayName = 'Select';

export default Select;
