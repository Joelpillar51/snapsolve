import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../state/userStore';

const avatarEmojis = ['🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫'];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { xp, level, streak, avatarId, isPro, dailySolves, dailyQuizzes, updateStreak } = useUserStore();

  React.useEffect(() => {
    updateStreak();
  }, []);

  const handleSnapQuestion = () => {
    navigation.navigate('Solve' as never);
  };

  const handleDailyQuiz = () => {
    navigation.navigate('Quiz' as never);
  };

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-white rounded-full p-4 shadow-sm mb-4">
            <Text className="text-4xl">{avatarEmojis[avatarId - 1]}</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">Welcome back!</Text>
          <Text className="text-gray-600 mt-1">Level {level} • {xp} XP</Text>
        </View>

        {/* XP Progress Bar */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-700">Progress to Level {level + 1}</Text>
            <Text className="text-sm text-gray-500">{xp % 100}/{xpForNextLevel}</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-3">
            <View 
              className="bg-blue-500 rounded-full h-3"
              style={{ width: `${xpProgress * 100}%` }}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row mb-8 space-x-4">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm items-center">
            <View className="bg-orange-100 rounded-full p-3 mb-2">
              <Ionicons name="flame" size={24} color="#FB923C" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{streak}</Text>
            <Text className="text-sm text-gray-600">Day Streak</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm items-center">
            <View className="bg-green-100 rounded-full p-3 mb-2">
              <Ionicons name="trophy" size={24} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{xp}</Text>
            <Text className="text-sm text-gray-600">Total XP</Text>
          </View>
        </View>

        {/* Main Action Buttons */}
        <View className="space-y-4 mb-8">
          <Pressable
            onPress={handleSnapQuestion}
            className="bg-blue-500 rounded-2xl p-6 shadow-lg active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="camera" size={32} color="white" />
              <Text className="text-white text-xl font-bold ml-3">Snap a Question</Text>
            </View>
            <Text className="text-blue-100 text-center mt-2">
              Take a photo and get instant solutions
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDailyQuiz}
            className="bg-purple-500 rounded-2xl p-6 shadow-lg active:scale-95"
            style={{ transform: [{ scale: 1 }] }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="school" size={32} color="white" />
              <Text className="text-white text-xl font-bold ml-3">Daily Quiz</Text>
            </View>
            <Text className="text-purple-100 text-center mt-2">
              Challenge yourself with practice questions
            </Text>
          </Pressable>
        </View>

        {/* Daily Usage */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Today's Usage</Text>
          
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="camera-outline" size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-2">Photo Solves</Text>
            </View>
            <Text className="text-gray-600">
              {dailySolves}/{isPro ? '∞' : '5'}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="school-outline" size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-2">Daily Quizzes</Text>
            </View>
            <Text className="text-gray-600">
              {dailyQuizzes}/{isPro ? '∞' : '1'}
            </Text>
          </View>
        </View>

        {/* Upgrade CTA */}
        {!isPro && (
          <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 shadow-lg">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">Upgrade to Pro</Text>
                <Text className="text-yellow-100 mt-1">
                  Unlimited solves & quizzes
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Profile' as never)}
                className="bg-white rounded-full px-6 py-3 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-orange-500 font-bold">Upgrade</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};