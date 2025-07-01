// Mock the react-native-reanimated module
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock the react-native module
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions = {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 })
  };
  return RN;
});

// Mock the react-native-vector-icons module
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');