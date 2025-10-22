import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'bg-white border border-neutral-300';
      case 'elevated':
        return 'bg-white shadow-lg';
      default:
        return 'bg-white shadow-md';
    }
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={`
        ${getVariantStyles()}
        rounded-xl p-4
        ${className}
      `}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};
