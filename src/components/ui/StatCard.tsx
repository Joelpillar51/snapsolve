import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { Colors } from '../../constants/Colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBackground?: string;
  subtitle?: string;
  onPress?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor = Colors.primary[500],
  iconBackground = Colors.primary[50],
  subtitle,
  onPress,
  className = '',
}) => {
  const Component = onPress ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      className={`flex-1 ${className}`}
      style={onPress ? { transform: [{ scale: 1 }] } : undefined}
    >
      <Card variant="elevated" className="items-center py-6">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
          style={{ backgroundColor: iconBackground }}
        >
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          {value}
        </Text>
        
        <Text className="text-sm font-medium text-gray-600 text-center">
          {title}
        </Text>
        
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-1 text-center">
            {subtitle}
          </Text>
        )}
      </Card>
    </Component>
  );
};