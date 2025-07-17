import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../state/userStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/Colors';

const avatarEmojis = [
  '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫',
  '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔬', '👨‍🔬', '👩‍🔬',
  '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍📚', '👨‍📚', '👩‍📚',
];

export const ProfileScreen = () => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const insets = useSafeAreaInsets();
  
  const { 
    avatarId, 
    xp, 
    level, 
    isPro, 
    setAvatar, 
    upgradeToPro,
    dailySolves,
    dailyQuizzes,
    streak
  } = useUserStore();

  const handleAvatarSelect = (newAvatarId: number) => {
    setAvatar(newAvatarId);
    setShowAvatarModal(false);
  };

  const handleUpgrade = () => {
    upgradeToPro();
    setShowUpgradeModal(false);
    Alert.alert('Success!', 'You have been upgraded to Pro! Enjoy unlimited solves and quizzes.');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For support, please email us at support@snapsolve.com',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About SnapSolve',
      'SnapSolve v1.0\n\nYour AI-powered learning companion. Snap photos of questions and get instant solutions with detailed explanations.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background.primary }}>
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="relative">
            <Pressable
              onPress={() => setShowAvatarModal(true)}
              className="bg-white rounded-full p-6 shadow-lg mb-4 active:scale-95 border-4 border-green-100"
              style={{ transform: [{ scale: 1 }] }}
            >
              <Text className="text-6xl">{avatarEmojis[avatarId - 1]}</Text>
            </Pressable>
            <View className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              <Ionicons name="pencil" size={16} color="white" />
            </View>
          </View>
          <Text className="text-3xl font-bold text-gray-800">Profile</Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-green-600 font-semibold">Level {level}</Text>
            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
            <Text className="text-green-600 font-semibold">{xp} XP</Text>
          </View>
        </View>

        {/* Subscription Status */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">Subscription</Text>
            <View className={`px-4 py-2 rounded-full ${
              isPro ? 'bg-amber-100 border border-amber-500' : 'bg-gray-100 border border-gray-300'
            }`}>
              <Text className={`text-sm font-bold ${
                isPro ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {isPro ? 'PRO' : 'FREE'}
              </Text>
            </View>
          </View>
          
          {isPro ? (
            <View className="bg-amber-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="#D97706" />
                <Text className="text-amber-800 font-bold ml-2">
                  Pro Member
                </Text>
              </View>
              <Text className="text-amber-700 mt-2 font-medium">
                You have unlimited access to all features!
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="bg-blue-50 rounded-xl p-4">
                <Text className="text-blue-800 font-bold mb-3">Free Plan Benefits:</Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons name="camera" size={16} color="#3B82F6" />
                    <Text className="text-blue-700 ml-2 font-medium">5 photo solves per day</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="school" size={16} color="#3B82F6" />
                    <Text className="text-blue-700 ml-2 font-medium">1 quiz per day</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="stats-chart" size={16} color="#3B82F6" />
                    <Text className="text-blue-700 ml-2 font-medium">Basic progress tracking</Text>
                  </View>
                </View>
              </View>
              
              <Button
                title="Upgrade to Pro"
                onPress={() => setShowUpgradeModal(true)}
                icon="rocket"
                size="large"
                className="bg-purple-500 shadow-xl shadow-purple-500/25"
              />
            </View>
          )}
        </Card>

        {/* Daily Usage */}
        <Card className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Today's Usage</Text>
          
          <View className="space-y-4">
            <View className="bg-green-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-green-500 rounded-full p-2 mr-3">
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                  <Text className="text-gray-700 font-bold">Photo Solves</Text>
                </View>
                <Text className="text-green-600 font-bold text-lg">
                  {dailySolves}/{isPro ? '∞' : '5'}
                </Text>
              </View>
            </View>
            
            <View className="bg-blue-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-blue-500 rounded-full p-2 mr-3">
                    <Ionicons name="school" size={20} color="white" />
                  </View>
                  <Text className="text-gray-700 font-bold">Daily Quizzes</Text>
                </View>
                <Text className="text-blue-600 font-bold text-lg">
                  {dailyQuizzes}/{isPro ? '∞' : '1'}
                </Text>
              </View>
            </View>
            
            <View className="bg-orange-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-orange-500 rounded-full p-2 mr-3">
                    <Ionicons name="flame" size={20} color="white" />
                  </View>
                  <Text className="text-gray-700 font-bold">Current Streak</Text>
                </View>
                <Text className="text-orange-500 font-bold text-lg">{streak} days</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Settings</Text>
          
          <View className="space-y-2">
            <Pressable
              onPress={() => setShowAvatarModal(true)}
              className="flex-row items-center justify-between py-4 active:bg-gray-50 rounded-xl px-4"
            >
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <Ionicons name="person-circle-outline" size={24} color={Colors.primary[600]} />
                </View>
                <Text className="text-gray-700 font-medium">Change Avatar</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
            
            <Pressable
              onPress={handleContactSupport}
              className="flex-row items-center justify-between py-4 active:bg-gray-50 rounded-xl px-4"
            >
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <Ionicons name="help-circle-outline" size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-700 font-medium">Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
            
            <Pressable
              onPress={handleAbout}
              className="flex-row items-center justify-between py-4 active:bg-gray-50 rounded-xl px-4"
            >
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-full p-2 mr-3">
                  <Ionicons name="information-circle-outline" size={24} color="#8B5CF6" />
                </View>
                <Text className="text-gray-700 font-medium">About SnapSolve</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </Card>
      </ScrollView>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Choose Avatar</Text>
            <Pressable
              onPress={() => setShowAvatarModal(false)}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>
          
          <ScrollView className="flex-1 p-6">
            <View className="flex-row flex-wrap">
              {avatarEmojis.map((emoji, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleAvatarSelect(index + 1)}
                  className={`w-24 h-24 rounded-2xl p-4 items-center justify-center active:scale-95 m-2 ${
                    avatarId === index + 1 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-gray-100'
                  }`}
                  style={{ transform: [{ scale: 1 }] }}
                >
                  <Text className="text-4xl">{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Upgrade to Pro</Text>
            <Pressable
              onPress={() => setShowUpgradeModal(false)}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>
          
          <ScrollView className="flex-1 p-6">
            <View className="items-center mb-8">
              <View className="bg-purple-500 rounded-full p-6 mb-4">
                <Ionicons name="star" size={48} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800">SnapSolve Pro</Text>
              <Text className="text-gray-600 text-center mt-2">
                Unlock unlimited learning potential
              </Text>
            </View>
            
            <View className="bg-gray-50 rounded-xl p-6 mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">Pro Features:</Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-gray-700 ml-3">Unlimited photo solves</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-gray-700 ml-3">Unlimited daily quizzes</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-gray-700 ml-3">Advanced progress analytics</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-gray-700 ml-3">Priority support</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  <Text className="text-gray-700 ml-3">Exclusive avatar collection</Text>
                </View>
              </View>
            </View>
            
            <Pressable
              onPress={handleUpgrade}
              className="bg-purple-500 rounded-xl p-4 active:scale-95 mb-4"
              style={{ transform: [{ scale: 1 }] }}
            >
              <Text className="text-white font-bold text-lg text-center">
                Upgrade Now - Free Demo
              </Text>
            </Pressable>
            
            <Text className="text-gray-500 text-center text-sm">
              * This is a demo version. In a real app, this would connect to a payment system.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};