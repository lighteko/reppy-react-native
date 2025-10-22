import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, TextInput, Modal } from '@/components/common';
import { useAuth } from '@/hooks';
import { useUserStore } from '@/store';
import { equipmentService, userService } from '@/services';
import { EquipmentListItem, UnitSystemEnum } from '@/types';
import { Check } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SettingsScreen() {
  const { profile, updateProfile, updatePreferences } = useUserStore();
  const { logout } = useAuth();

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unitSystem, setUnitSystem] = useState<UnitSystemEnum>(UnitSystemEnum.CM_KG);
  const [locale, setLocale] = useState('en-US');

  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [allEquipment, setAllEquipment] = useState<EquipmentListItem[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setWeight(profile.bodyWeight?.toString() || '');
      setHeight(profile.height?.toString() || '');
      setUnitSystem(profile.unitSystem);
      setLocale(profile.locale);
      setSelectedEquipment(profile.availableEquipment.map((e) => e.equipmentId));
    }
  }, [profile]);

  const loadEquipment = async () => {
    try {
      const equipment = await equipmentService.getEquipmentList(locale);
      setAllEquipment(equipment);
    } catch (error) {
      console.error('Error loading equipment:', error);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, [locale]);

  const handleSaveProfile = async () => {
    if (!profile?.userId) return;

    try {
      setSaving(true);
      await userService.updateUserBio(profile.userId, {
        bodyWeight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      } as any);

      updateProfile({
        bodyWeight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      });

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!profile?.userId) return;

    try {
      setSaving(true);
      await userService.updateUserPreferences(profile.userId, {
        unitSystem,
        locale,
      } as any);

      updatePreferences(unitSystem, locale);

      Alert.alert('Success', 'Preferences updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEquipment = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleSaveEquipment = async () => {
    if (!profile?.userId) return;

    try {
      setSaving(true);
      const updated = await equipmentService.updateUserEquipment(
        profile.userId,
        selectedEquipment
      );

      updateProfile({ availableEquipment: updated });
      setShowEquipmentModal(false);
      Alert.alert('Success', 'Equipment updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update equipment');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth');
        },
      },
    ]);
  };

  const groupedEquipment = allEquipment.reduce((acc, item) => {
    if (!acc[item.equipmentType]) {
      acc[item.equipmentType] = [];
    }
    acc[item.equipmentType].push(item);
    return acc;
  }, {} as Record<string, EquipmentListItem[]>);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-neutral-200">
        <Text className="text-2xl font-bold text-neutral-900">Settings</Text>
        <Text className="text-sm text-neutral-600 mt-1">
          Manage your profile and preferences
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-neutral-900 mb-3">
            Profile
          </Text>

          <Card variant="outlined" className="mb-6">
            <Text className="text-sm text-neutral-600 mb-3">
              Username: {profile?.username}
            </Text>

            <TextInput
              label="Body Weight"
              value={weight}
              onChangeText={setWeight}
              placeholder="70"
              keyboardType="decimal-pad"
              helperText={unitSystem === UnitSystemEnum.CM_KG ? 'kg' : 'lbs'}
            />

            <TextInput
              label="Height"
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              keyboardType="decimal-pad"
              helperText={unitSystem === UnitSystemEnum.CM_KG ? 'cm' : 'inches'}
            />

            <Button
              title="Save Profile"
              onPress={handleSaveProfile}
              loading={saving}
              fullWidth
            />
          </Card>

          <Text className="text-lg font-bold text-neutral-900 mb-3">
            Preferences
          </Text>

          <Card variant="outlined" className="mb-6">
            <Text className="font-semibold text-neutral-900 mb-2">
              Unit System
            </Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                onPress={() => setUnitSystem(UnitSystemEnum.CM_KG)}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  unitSystem === UnitSystemEnum.CM_KG
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-300'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    unitSystem === UnitSystemEnum.CM_KG
                      ? 'text-primary-500'
                      : 'text-neutral-700'
                  }`}
                >
                  Metric (kg/cm)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUnitSystem(UnitSystemEnum.IN_LB)}
                className={`flex-1 py-3 rounded-lg border-2 ${
                  unitSystem === UnitSystemEnum.IN_LB
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-300'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    unitSystem === UnitSystemEnum.IN_LB
                      ? 'text-primary-500'
                      : 'text-neutral-700'
                  }`}
                >
                  Imperial (lbs/in)
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Save Preferences"
              onPress={handleSavePreferences}
              loading={saving}
              fullWidth
            />
          </Card>

          <Text className="text-lg font-bold text-neutral-900 mb-3">
            Equipment
          </Text>

          <Card variant="outlined" className="mb-6">
            <Text className="text-sm text-neutral-600 mb-3">
              Manage your available workout equipment
            </Text>

            <View className="mb-3">
              <Text className="font-semibold text-neutral-900 mb-2">
                Selected Equipment ({profile?.availableEquipment.length || 0})
              </Text>
              {profile?.availableEquipment.slice(0, 5).map((equip) => (
                <Text key={equip.equipmentId} className="text-sm text-neutral-700">
                  • {equip.equipmentName}
                </Text>
              ))}
              {(profile?.availableEquipment.length || 0) > 5 && (
                <Text className="text-sm text-neutral-500 mt-1">
                  +{profile!.availableEquipment.length - 5} more
                </Text>
              )}
            </View>

            <Button
              title="Manage Equipment"
              onPress={() => setShowEquipmentModal(true)}
              variant="outline"
              fullWidth
            />
          </Card>

          <Card variant="outlined" className="mb-6">
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="ghost"
              fullWidth
            />
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        title="Select Equipment"
        size="lg"
      >
        <ScrollView className="max-h-96">
          {Object.entries(groupedEquipment).map(([type, items]) => (
            <View key={type} className="mb-4">
              <Text className="font-bold text-neutral-900 mb-2">
                {type.replace(/_/g, ' ')}
              </Text>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.equipmentId}
                  onPress={() => handleToggleEquipment(item.equipmentId)}
                  className="flex-row items-center justify-between py-3 border-b border-neutral-100"
                >
                  <Text className="text-neutral-900 flex-1">
                    {item.equipmentName}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded border-2 items-center justify-center ${
                      selectedEquipment.includes(item.equipmentId)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedEquipment.includes(item.equipmentId) && (
                      <Check size={16} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View className="mt-4">
          <Button
            title="Save Equipment"
            onPress={handleSaveEquipment}
            loading={saving}
            fullWidth
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
