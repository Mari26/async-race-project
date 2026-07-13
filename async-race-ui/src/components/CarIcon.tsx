interface CarIconProps {
  color: string;
  width?: string;
}

export default function CarIcon({ color, width = '70px' }: CarIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width={width} style={{ display: 'block' }}>
      <path
        d="M15 25h70l5-8H65l-5-7H35l-5 7H10z"
        fill={color}
        stroke="#333"
        strokeWidth="2"
      />
      <circle cx="28" cy="28" r="7" fill="#333" stroke="#fff" strokeWidth="2" />
      <circle cx="72" cy="28" r="7" fill="#333" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}