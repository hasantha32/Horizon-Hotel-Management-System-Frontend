export const MessageAvatarPlaceholderIcon = ({
  color = 'currentColor',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20Zm1.116-28.32 7.204 7.204c.89.89.909 2.317.04 3.186l-6.29 6.29c-.869.869-2.295.85-3.186-.04l-7.204-7.204a2.298 2.298 0 0 1-.642-2.042l.994-5.297a2.177 2.177 0 0 1 1.745-1.744l5.297-.995a2.298 2.298 0 0 1 2.042.642Zm-6.123 5.672a1.668 1.668 0 1 0 2.359-2.36 1.668 1.668 0 0 0-2.36 2.36Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
