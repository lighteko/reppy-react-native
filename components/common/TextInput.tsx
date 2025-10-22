import React from 'react';
import { View, Text, TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-neutral-700 font-medium mb-2 text-sm">{label}</Text>
      )}
      <View
        className={`
          flex-row items-center
          bg-white border rounded-lg
          ${error ? 'border-error' : 'border-neutral-300'}
          ${props.editable === false ? 'bg-neutral-100' : ''}
        `}
      >
        {leftIcon && (
          <View className="pl-3">{leftIcon}</View>
        )}
        <RNTextInput
          {...props}
          className={`
            flex-1 px-4 py-3 text-base text-neutral-900
            ${leftIcon ? 'pl-2' : ''}
            ${rightIcon ? 'pr-2' : ''}
          `}
          placeholderTextColor="#9ca3af"
        />
        {rightIcon && (
          <View className="pr-3">{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text className="text-error text-xs mt-1">{error}</Text>
      )}
      {helperText && !error && (
        <Text className="text-neutral-500 text-xs mt-1">{helperText}</Text>
      )}
    </View>
  );
};
