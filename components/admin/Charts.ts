import { Platform } from 'react-native';

// Provide platform-agnostic re-exports for Victory components
// Web: use 'victory'. Native: use 'victory-native'.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const V: any = Platform.OS === 'web' ? require('victory') : require('victory-native');

export const VictoryChart = V.VictoryChart;
export const VictoryBar = V.VictoryBar;
export const VictoryTheme = V.VictoryTheme;
export const VictoryArea = V.VictoryArea;
export const VictoryAxis = V.VictoryAxis;
export const VictoryPie = V.VictoryPie;
