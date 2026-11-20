import Svg, { Line, Path } from 'react-native-svg';

const COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
};

/**
 * Google's brand mark for the "Continue with Google" button — a four-colour ring
 * with the blue crossbar, drawn in Google's palette. Rendered as SVG so it stays
 * crisp at any size (unlike the monochrome Ionicons glyph).
 */
export function GoogleIcon({ size = 20 }: { size?: number }) {
  const stroke = 6.5;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityRole="image">
      {/* left */}
      <Path
        d="M13.04 34.96 A15.5 15.5 0 0 1 13.04 13.04"
        stroke={COLORS.yellow}
        strokeWidth={stroke}
        fill="none"
      />
      {/* top */}
      <Path
        d="M13.04 13.04 A15.5 15.5 0 0 1 34.96 13.04"
        stroke={COLORS.red}
        strokeWidth={stroke}
        fill="none"
      />
      {/* bottom */}
      <Path
        d="M34.96 34.96 A15.5 15.5 0 0 1 13.04 34.96"
        stroke={COLORS.green}
        strokeWidth={stroke}
        fill="none"
      />
      {/* right (leaves the mouth open at the lower right) */}
      <Path
        d="M34.96 13.04 A15.5 15.5 0 0 1 39.26 26.69"
        stroke={COLORS.blue}
        strokeWidth={stroke}
        fill="none"
      />
      {/* crossbar */}
      <Line
        x1={23}
        y1={24}
        x2={38}
        y2={24}
        stroke={COLORS.blue}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </Svg>
  );
}
