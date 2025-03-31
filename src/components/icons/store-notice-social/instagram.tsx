export const InstagramIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.6 12a3.6 3.6 0 11-7.2 0c0-.205.022-.406.06-.6H7.2v4.796c0 .334.27.604.604.604h8.394a.603.603 0 00.602-.604V11.4h-1.258c.037.194.059.395.059.6zM12 14.4a2.4 2.4 0 100-4.799 2.4 2.4 0 000 4.799zm2.88-4.92h1.44a.361.361 0 00.36-.36V7.681a.361.361 0 00-.36-.361h-1.44a.361.361 0 00-.36.361V9.12c0 .198.162.36.36.36zM12 .48a11.52 11.52 0 100 23.04A11.52 11.52 0 0012 .48zm6 16.187C18 17.4 17.4 18 16.668 18H7.334C6.6 18 6 17.4 6 16.667V7.333C6 6.6 6.6 6 7.334 6h9.333C17.4 6 18 6.6 18 7.333v9.334z"
        fill="url(#paint0_linear_840_4571)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_840_4571"
          x1={4}
          y1={5}
          x2={18.5}
          y2={21.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5E52CB" />
          <stop offset={0.328125} stopColor="#A238B1" />
          <stop offset={0.671875} stopColor="#F04C5A" />
          <stop offset={1} stopColor="#FF9148" />
        </linearGradient>
      </defs>
    </svg>
  );
};
