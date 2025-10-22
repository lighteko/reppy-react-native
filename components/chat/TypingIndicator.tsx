import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const TypingIndicator: React.FC = () => {
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (opacity: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(opacity1, 0);
    animate(opacity2, 200);
    animate(opacity3, 400);
  }, [opacity1, opacity2, opacity3]);

  return (
    <View className="flex-row items-center mb-4">
      <View className="bg-neutral-100 rounded-2xl px-4 py-3 flex-row gap-1.5">
        <Animated.View
          style={{ opacity: opacity1 }}
          className="w-2 h-2 rounded-full bg-neutral-500"
        />
        <Animated.View
          style={{ opacity: opacity2 }}
          className="w-2 h-2 rounded-full bg-neutral-500"
        />
        <Animated.View
          style={{ opacity: opacity3 }}
          className="w-2 h-2 rounded-full bg-neutral-500"
        />
      </View>
    </View>
  );
};
