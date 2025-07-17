import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  color = '#22c55e',
  backgroundColor = '#f3f4f6',
  height = 12,
  className = '',
}) => {
  const progressValue = useSharedValue(0);

  React.useEffect(() => {
    progressValue.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value * 100}%`,
    };
  });

  const percentage = Math.round(progress * 100);

  return (
    <View className={className}>
      {(label || showPercentage) && (
        <View className="flex-row items-center justify-between mb-2">
          {label && (
            <Text className="text-sm font-medium text-gray-700">{label}</Text>
          )}
          {showPercentage && (
            <Text className="text-sm text-gray-500">{percentage}%</Text>
          )}
        </View>
      )}
      <View
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor }}
      >
        <Animated.View
          className="h-full rounded-full"
          style={[{ backgroundColor: color }, animatedStyle]}
        />
      </View>
    </View>
  );
};