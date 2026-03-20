export function SpinnerIcon({ width = 24, height = 24, stroke = "currentColor" }: { width?: number; height?: number; stroke?: string }) {
  return (
    <svg className="animate-spin" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
