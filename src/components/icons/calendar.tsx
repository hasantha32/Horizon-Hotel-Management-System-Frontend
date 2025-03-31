export const CalendarIcon: React.FC<React.SVGAttributes<{}>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4.75 1v2.25M15.25 1v2.25M1 16.75V5.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 19 5.5v11.25m-18 0A2.25 2.25 0 0 0 3.25 19h13.5A2.25 2.25 0 0 0 19 16.75m-18 0v-7.5A2.25 2.25 0 0 1 3.25 7h13.5A2.25 2.25 0 0 1 19 9.25v7.5m-9-6h.008v.008H10v-.008ZM10 13h.008v.008H10V13Zm0 2.25h.008v.008H10v-.008ZM7.75 13h.008v.008H7.75V13Zm0 2.25h.008v.008H7.75v-.008ZM5.5 13h.008v.008H5.5V13Zm0 2.25h.008v.008H5.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H14.5v-.008Zm0 2.25h.008v.008H14.5V13Z"
    />
  </svg>
);

export const CalendarGhostIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        opacity={0.2}
        d="M13.5 3v2.5h-11V3a.5.5 0 01.5-.5h10a.5.5 0 01.5.5z"
        fill="currentColor"
      />
      <path
        d="M13 2h-1.5v-.5a.5.5 0 00-1 0V2h-5v-.5a.5.5 0 10-1 0V2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1zM4.5 3v.5a.5.5 0 101 0V3h5v.5a.5.5 0 001 0V3H13v2H3V3h1.5zM13 13H3V6h10v7z"
        fill="currentColor"
      />
    </svg>
  );
};