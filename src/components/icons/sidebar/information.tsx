export const InformationIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        opacity={0.2}
      />
      <path
        fill="currentColor"
        d="M11.25 13.75a.624.624 0 0 1-.625.625 1.25 1.25 0 0 1-1.25-1.25V10a.625.625 0 0 1 0-1.25 1.25 1.25 0 0 1 1.25 1.25v3.125a.624.624 0 0 1 .625.625ZM18.125 10A8.125 8.125 0 1 1 10 1.875 8.133 8.133 0 0 1 18.125 10Zm-1.25 0A6.875 6.875 0 1 0 10 16.875 6.883 6.883 0 0 0 16.875 10ZM9.687 7.5a.938.938 0 1 0 0-1.875.938.938 0 0 0 0 1.875Z"
      />
    </svg>
  );
};
