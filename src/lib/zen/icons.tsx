export type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const defaultSize = 20;

export function BackArrowIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14.5 6.5L9 12l5.5 5.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TimerIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 2h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 8v4l3 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={12}
        cy={13}
        r={8}
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
}

export function ProgressDotsIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  const dotR = 1.7;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx={7} cy={12} r={dotR} fill={color} />
      <circle cx={12} cy={12} r={dotR} fill={color} opacity={0.75} />
      <circle cx={17} cy={12} r={dotR} fill={color} opacity={0.5} />
    </svg>
  );
}

export function BreatheIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx={12} cy={12} r={7.5} stroke={color} strokeWidth={2} opacity={0.9} />
      <circle cx={12} cy={12} r={3.25} fill={color} opacity={0.25} />
    </svg>
  );
}

export function OrientIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx={12} cy={12} r={8} stroke={color} strokeWidth={2} opacity={0.5} />
      <circle cx={12} cy={12} r={4} stroke={color} strokeWidth={2} />
      <path
        d="M12 6v2M12 16v2M6 12h2M16 12h2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShakeIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 14c2-4 4 4 6 0s4 4 6 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10c2-4 4 4 6 0s4 4 6 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
      />
    </svg>
  );
}

export function GroundIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 18.5L5.5 8.5h13L12 18.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5h7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}

export function CheckIcon({ size = defaultSize, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 7L10.5 16.5L4 10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
