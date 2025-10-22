import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from '@/components/common';
import { useAuth } from '@/hooks';
import { validateEmail, validatePassword, validateUsername } from '@/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dumbbell } from 'lucide-react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, signup, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !username) {
      newErrors.username = 'Username is required';
    } else if (!isLogin) {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        newErrors.username = usernameValidation.message || 'Invalid username';
      }
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message || 'Invalid password';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let success = false;
    if (isLogin) {
      success = await login({ email, password });
    } else {
      success = await signup({ username, email, password });
    }

    if (success) {
      router.replace('/onboarding');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-12">
            <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-4">
              <Dumbbell size={48} color="#ffffff" />
            </View>
            <Text className="text-4xl font-bold text-neutral-900 mb-2">Reppy</Text>
            <Text className="text-lg text-neutral-600">Your AI Fitness Coach</Text>
          </View>

          <View className="mb-6">
            {!isLogin && (
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                error={errors.username}
                autoCapitalize="none"
              />
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />
          </View>

          {error && (
            <View className="mb-4 bg-error/10 rounded-lg p-3">
              <Text className="text-error text-center">{error}</Text>
            </View>
          )}

          <Button
            title={isLogin ? 'Log In' : 'Sign Up'}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Text
              onPress={toggleMode}
              className="text-primary-500 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
