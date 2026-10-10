import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Stroke icons drawn for Wish Me (docs/design.md), always decorative: the control carrying
// one has its own label.
const paths = {
  plus: <Path d="M12 5v14M5 12h14" />,
  chevronLeft: <Path d="M15 18l-6-6 6-6" />,
  chevronRight: <Path d="M9 6l6 6-6 6" />,
  more: (
    <>
      <Circle cx={5} cy={12} r={1.4} />
      <Circle cx={12} cy={12} r={1.4} />
      <Circle cx={19} cy={12} r={1.4} />
    </>
  ),
  lock: (
    <>
      <Rect x={5} y={11} width={14} height={10} rx={2.5} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  lists: (
    <>
      <Rect x={4} y={4} width={16} height={16} rx={4} />
      <Path d="M8 9h8M8 13h8M8 17h5" />
    </>
  ),
  account: (
    <>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  link: <Path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
} as const;

export type IconName = keyof typeof paths;

type Props = { name: IconName; color: string; size?: number; strokeWidth?: number };

export function Icon({ name, color, size = 20, strokeWidth = 2 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </Svg>
  );
}
