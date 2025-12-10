import { BlurView as ExpoBlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import RNLottieView from 'lottie-react-native';
import { LineChart as GCLineChart } from 'react-native-gifted-charts';
import { withUniwind } from 'uniwind';

export const LinearGradient = withUniwind(ExpoLinearGradient);
export const Image = withUniwind(ExpoImage);
export const LineChart = withUniwind(GCLineChart);
export const LottieView = withUniwind(RNLottieView);
export const BlurView = withUniwind(ExpoBlurView);
