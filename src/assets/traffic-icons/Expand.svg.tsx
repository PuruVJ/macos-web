export function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.88 12.88" {...props}>
      <circle cx="6.44" cy="6.44" r="6.44" style={{ fill: 'none' }} />
      <path
        d="M6.5,3.34V9.66M9.66,6.5H3.34"
        style={{
          fill: 'none',
          stroke: 'black',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 1.5,
        }}
      />
    </svg>
  );
}
