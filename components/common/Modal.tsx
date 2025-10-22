import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const getWidthStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-11/12 max-w-sm';
      case 'md':
        return 'w-11/12 max-w-md';
      case 'lg':
        return 'w-11/12 max-w-lg';
      case 'full':
        return 'w-full h-full';
      default:
        return 'w-11/12 max-w-md';
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className={`${getWidthStyles()} bg-white rounded-2xl ${size === 'full' ? '' : 'max-h-4/5'}`}>
              {title && (
                <View className="flex-row items-center justify-between p-4 border-b border-neutral-200">
                  <Text className="text-lg font-bold text-neutral-900">{title}</Text>
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose} className="p-1">
                      <X size={24} color="#6c757d" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <ScrollView className="p-4">
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};
