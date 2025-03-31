import { useCallback, Children, isValidElement, cloneElement } from 'react';

export interface CheckboxProps {
  values: any[];
  onChange: (value: string[]) => void;
  children: React.ReactNode;
}
interface EnrichedChildren {
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  checked: boolean;
  value: string;
  children?: React.ReactNode;
}
//TODO: we may handle select all checkbox in a better way
export default function CheckboxGroup({
  children,
  values,
  onChange,
}: CheckboxProps) {
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const newValues = values.includes(name)
        ? values.filter((v) => v !== name)
        : [...values, name];
      onChange(newValues);
    },
    [values, onChange]
  );

  return (
    <>
      {Children.map(children, (child) => {
        if (!isValidElement<EnrichedChildren>(child)) {
          return child;
        }
        return cloneElement(child, {
          onChange: onChangeHandler,
          checked: values?.includes(child.props.value),
        });
      })}
    </>
  );
}
