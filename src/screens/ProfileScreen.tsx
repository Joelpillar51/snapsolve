import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../state/userStore';

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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Pressable
            onPress={() => setShowAvatarModal(true)}
            className="bg-white rounded-full p-4 shadow-sm mb-4 active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <Text className="text-6xl">{avatarEmojis[avatarId - 1]}</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-gray-600">Level {level}</Text>
            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
            <Text className="text-gray-600">{xp} XP</Text>
          </View>
        </View>

        {/* Subscription Status */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">Subscription</Text>
            <View className={`px-3 py-1 rounded-full ${
              isPro ? 'bg-gold-100 border border-gold-500' : 'bg-gray-100 border border-gray-300'
            }`}>
              <Text className={`text-sm font-bold ${
                isPro ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {isPro ? 'PRO' : 'FREE'}
              </Text>
            </View>
          </View>
          
          {isPro ? (
            <View className="bg-yellow-50 rounded-lg p-4">
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="#D97706" />
                <Text className="text-yellow-800 font-medium ml-2">
                  Pro Member
                </Text>
              </View>
              <Text className="text-yellow-700 mt-2">
                You have unlimited access to all features!
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="bg-blue-50 rounded-lg p-4">
                <Text className="text-blue-800 font-medium mb-2">Free Plan Benefits:</Text>
                <View className="space-y-1">
                  <Text className="text-blue-700">• 5 photo solves per day</Text>
                  <Text className="text-blue-700">• 1 quiz per day</Text>
                  <Text className="text-blue-700">• Basic progress tracking</Text>
                </View>
              </View>
              
              <Pressable
                onPress={() => setShowUpgradeModal(true)}
                className="bg-purple-500 rounded-xl p-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="rocket" size={24} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">Upgrade to Pro</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>

        {/* Daily Usage */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Today's Usage</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <Ionicons name="camera" size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-700 font-medium">Photo Solves</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600">{dailySolves}</Text>
                <Text className="text-gray-400 mx-1">/</Text>
                <Text className="text-gray-600">{isPro ? '∞' : '5'}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-full p-2 mr-3">
                  <Ionicons name="school" size={20} color="#8B5CF6" />
                </View>
                <Text className="text-gray-700 font-medium">Daily Quizzes</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600">{dailyQuizzes}</Text>
                <Text className="text-gray-400 mx-1">/</Text>
                <Text className="text-gray-600">{isPro ? '∞' : '1'}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-orange-100 rounded-full p-2 mr-3">
                  <Ionicons name="flame" size={20} color="#FB923C" />
                </View>
                <Text className="text-gray-700 font-medium">Current Streak</Text>
              </View>
              <Text className="text-orange-500 font-bold">{streak} days</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>
          
          <View className="space-y-1">
            <Pressable
              onPress={() => setShowAvatarModal(true)}
              className="flex-row items-center justify-between py-3 active:bg-gray-50 rounded-lg px-3"
            >
              <View className="flex-row items-center">
                <Ionicons name="person-circle-outline" size={24} color="#6B7280" />
                <Text className="text-gray-700 ml-3">Change Avatar</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
            
            <Pressable
              onPress={handleContactSupport}
              className="flex-row items-center justify-between py-3 active:bg-gray-50 rounded-lg px-3"
            >
              <View className="flex-row items-center">
                <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
                <Text className="text-gray-700 ml-3">Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
            
            <Pressable
              onPress={handleAbout}
              className="flex-row items-center justify-between py-3 active:bg-gray-50 rounded-lg px-3"
            >
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                <Text className="text-gray-700 ml-3">About SnapSolve</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>
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