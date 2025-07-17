import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const getButtonStyle = () => {
    const baseStyle = 'rounded-2xl flex-row items-center justify-center active:scale-95';
    
    const sizeStyles = {
      small: 'px-4 py-2',
      medium: 'px-6 py-4',
      large: 'px-8 py-5',
    };

    const variantStyles = {
      primary: 'bg-green-500 shadow-lg',
      secondary: 'bg-green-100 border-2 border-green-500',
      outline: 'border-2 border-green-500 bg-transparent',
      ghost: 'bg-transparent',
    };

    const disabledStyle = disabled ? 'opacity-50' : '';

    return `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyle} ${className}`;
  };

  const getTextStyle = () => {
    const baseStyle = 'font-semibold text-center';
    
    const sizeStyles = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    const variantStyles = {
      primary: 'text-white',
      secondary: 'text-green-700',
      outline: 'text-green-600',
      ghost: 'text-green-600',
    };

    return `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.neutral.white;
      case 'secondary':
        return Colors.primary[700];
      case 'outline':
        return Colors.primary[600];
      case 'ghost':
        return Colors.primary[600];
      default:
        return Colors.neutral.white;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={getButtonStyle()}
      style={{ transform: [{ scale: 1 }] }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View className="flex-row items-center">
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text className={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};