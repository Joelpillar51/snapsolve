import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const getCardStyle = () => {
    const baseStyle = 'bg-white rounded-3xl p-6';
    
    const variantStyles = {
      default: 'shadow-sm',
      elevated: 'shadow-lg',
      outlined: 'border border-gray-200',
      flat: '',
    };

    return `${baseStyle} ${variantStyles[variant]} ${className}`;
  };

  return (
    <View className={getCardStyle()} {...props}>
      {children}
    </View>
  );
};