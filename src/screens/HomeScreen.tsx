import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '../types/navigation';
import { useUserStore } from '../state/userStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCard } from '../components/ui/StatCard';
import { Colors } from '../constants/Colors';

const avatarEmojis = ['🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫'];

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const insets = useSafeAreaInsets();
  const { xp, level, streak, avatarId, isPro, dailySolves, dailyQuizzes, updateStreak } = useUserStore();

  React.useEffect(() => {
    updateStreak();
  }, []);

  const handleSnapQuestion = () => {
    try {
      if (navigation) {
        navigation.navigate('Solve');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleDailyQuiz = () => {
    try {
      if (navigation) {
        navigation.navigate('Quiz');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / 100;

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
            <View className="bg-white rounded-full p-6 shadow-lg mb-4 border-4 border-green-100">
              <Text className="text-5xl">{avatarEmojis[avatarId - 1]}</Text>
            </View>
            <View className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white font-bold text-sm">{level}</Text>
            </View>
          </View>
          <Text className="text-3xl font-bold text-gray-800">Hey there!</Text>
          <Text className="text-green-600 mt-1 font-semibold">Level {level} • {xp} XP</Text>
        </View>

        {/* XP Progress */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">Level Progress</Text>
            <View className="bg-green-100 rounded-full px-3 py-1">
              <Text className="text-green-700 font-semibold text-sm">
                {Math.round((1 - xpProgress) * 100)} XP to next level
              </Text>
            </View>
          </View>
          <ProgressBar 
            progress={xpProgress}
            color={Colors.primary[500]}
            backgroundColor={Colors.primary[100]}
            height={16}
          />
        </Card>

        {/* Stats Grid */}
        <View className="flex-row mb-8 space-x-4">
          <StatCard
            title="Day Streak"
            value={`${streak} 🔥`}
            icon="flame"
            iconColor={Colors.accent.orange}
            iconBackground="#fff7ed"
          />
          
          <StatCard
            title="Total XP"
            value={xp}
            icon="trophy"
            iconColor={Colors.primary[500]}
            iconBackground={Colors.primary[50]}
          />
        </View>

        {/* Main Action Buttons */}
        <View className="space-y-4 mb-8">
          <Button
            title="Snap a Question"
            onPress={handleSnapQuestion}
            icon="camera"
            size="large"
            className="bg-green-500 shadow-xl shadow-green-500/25"
          />

          <Button
            title="Daily Quiz"
            onPress={handleDailyQuiz}
            icon="school"
            size="large"
            variant="secondary"
            className="border-green-500 bg-green-50 shadow-xl shadow-green-500/10"
          />
        </View>

        {/* Daily Usage Card */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">Today's Activity</Text>
            <View className="bg-green-100 rounded-full p-2">
              <Ionicons name="calendar" size={16} color={Colors.primary[600]} />
            </View>
          </View>
          
          <View className="space-y-4">
            <View className="bg-green-50 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-green-500 rounded-full p-2 mr-3">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                  <Text className="text-gray-700 font-medium">Photo Solves</Text>
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
                    <Ionicons name="school" size={16} color="white" />
                  </View>
                  <Text className="text-gray-700 font-medium">Daily Quizzes</Text>
                </View>
                <Text className="text-blue-600 font-bold text-lg">
                  {dailyQuizzes}/{isPro ? '∞' : '1'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Upgrade CTA */}
        {!isPro && (
          <Card className="bg-gradient-to-r from-amber-400 to-orange-500 shadow-xl shadow-orange-500/25">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">Upgrade to Pro</Text>
                <Text className="text-amber-100 mt-1 font-medium">
                  Unlimited solves & quizzes
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                className="bg-white rounded-2xl px-6 py-3 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-orange-500 font-bold">Upgrade</Text>
              </Pressable>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};