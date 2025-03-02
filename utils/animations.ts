import { useRef, useEffect } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// Staggered animation for list items
export const useStaggeredAnimation = (index: number, delay = 100) => {
  const { animationsEnabled, reducedMotion } = useSelector(
    (state: RootState) => state.userPreferences
  );
  
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    if (!animationsEnabled) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    
    const duration = reducedMotion ? 150 : 300;
    const itemDelay = reducedMotion ? 20 : delay;
    
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: index * itemDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay: index * itemDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, [index, opacity, translateY, animationsEnabled, reducedMotion, delay]);
  
  return {
    opacity,
    transform: [{ translateY }],
  };
};

// Fade in animation
export const useFadeInAnimation = (duration = 300, delay = 0) => {
  const { animationsEnabled, reducedMotion } = useSelector(
    (state: RootState) => state.userPreferences
  );
  
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (!animationsEnabled) {
      opacity.setValue(1);
      return;
    }
    
    const animDuration = reducedMotion ? duration / 2 : duration;
    
    Animated.timing(opacity, {
      toValue: 1,
      duration: animDuration,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [opacity, animationsEnabled, reducedMotion, duration, delay]);
  
  return { opacity };
};

// Scale animation for buttons
export const useScaleAnimation = (
  activeScale = 0.95,
  duration = 100
): [
  { transform: { scale: Animated.Value }[] },
  () => void,
  () => void
] => {
  const { animationsEnabled, reducedMotion } = useSelector(
    (state: RootState) => state.userPreferences
  );
  
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    if (!animationsEnabled) return;
    
    Animated.timing(scale, {
      toValue: activeScale,
      duration: reducedMotion ? duration / 2 : duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  
  const handlePressOut = () => {
    if (!animationsEnabled) return;
    
    Animated.timing(scale, {
      toValue: 1,
      duration: reducedMotion ? duration / 2 : duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  
  return [
    { transform: [{ scale }] },
    handlePressIn,
    handlePressOut,
  ];
};

// Slide in animation
export const useSlideInAnimation = (
  direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  distance = 100,
  duration = 300,
  delay = 0
) => {
  const { animationsEnabled, reducedMotion } = useSelector(
    (state: RootState) => state.userPreferences
  );
  
  const translateX = useRef(new Animated.Value(
    direction === 'left' ? -distance : direction === 'right' ? distance : 0
  )).current;
  
  const translateY = useRef(new Animated.Value(
    direction === 'top' ? -distance : direction === 'bottom' ? distance : 0
  )).current;
  
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (!animationsEnabled) {
      translateX.setValue(0);
      translateY.setValue(0);
      opacity.setValue(1);
      return;
    }
    
    const animDuration = reducedMotion ? duration / 2 : duration;
    
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: animDuration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: animDuration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: animDuration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, [translateX, translateY, opacity, animationsEnabled, reducedMotion, duration, delay]);
  
  return {
    opacity,
    transform: [
      { translateX },
      { translateY },
    ],
  };
};
