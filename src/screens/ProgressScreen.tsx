import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '../types/navigation';
import { useUserStore } from '../state/userStore';
import { useQuizStore } from '../state/quizStore';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCard } from '../components/ui/StatCard';
import { Colors } from '../constants/Colors';

export const ProgressScreen = () => {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const insets = useSafeAreaInsets();
  const { xp, level, streak, isPro } = useUserStore();
  const { quizHistory } = useQuizStore();

  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / 100;

  const getStreakCalendar = () => {
    const calendar = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const isToday = i === 0;
      const isActive = i < streak || (i === 0 && streak > 0);
      
      calendar.push({
        day: dayOfWeek,
        number: dayNumber,
        isToday,
        isActive,
      });
    }
    
    return calendar;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-500';
    if (score >= 70) return 'bg-yellow-100 border-yellow-500';
    return 'bg-red-100 border-red-500';
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
          <View className="bg-green-100 rounded-full p-6 mb-4 shadow-lg">
            <Ionicons name="stats-chart" size={56} color={Colors.primary[600]} />
          </View>
          <Text className="text-3xl font-bold text-gray-800">Your Progress</Text>
          <Text className="text-gray-600 mt-2 text-center font-medium">
            Track your amazing learning journey
          </Text>
        </View>

        {/* Level Progress */}
        <Card className="mb-6">
          <View className="items-center mb-6">
            <View className="bg-green-100 rounded-full p-4 mb-4">
              <Text className="text-4xl font-bold text-green-600">Level {level}</Text>
            </View>
            <Text className="text-gray-600 text-lg font-medium">{xp} Total XP</Text>
          </View>
          
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-gray-800">
                Progress to Level {level + 1}
              </Text>
              <Text className="text-green-600 font-semibold">
                {xp % 100}/{xpForNextLevel}
              </Text>
            </View>
            <ProgressBar 
              progress={xpProgress}
              color={Colors.primary[500]}
              backgroundColor={Colors.primary[100]}
              height={16}
            />
          </View>
          
          <View className="bg-green-50 rounded-xl p-4">
            <Text className="text-green-800 font-semibold text-center">
              {Math.round((1 - xpProgress) * 100)} XP until next level!
            </Text>
          </View>
        </Card>

        {/* Streak Calendar */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">Daily Streak</Text>
            <View className="flex-row items-center bg-orange-100 rounded-full px-4 py-2">
              <Ionicons name="flame" size={24} color="#FB923C" />
              <Text className="text-xl font-bold text-orange-500 ml-2">{streak}</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-4">
            {getStreakCalendar().map((day, index) => (
              <View key={index} className="items-center">
                <Text className="text-xs text-gray-600 mb-2 font-medium">{day.day}</Text>
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
                  day.isActive 
                    ? 'bg-orange-500 shadow-lg' 
                    : 'bg-gray-200'
                } ${day.isToday ? 'border-2 border-orange-600' : ''}`}>
                  <Text className={`text-sm font-bold ${
                    day.isActive ? 'text-white' : 'text-gray-600'
                  }`}>
                    {day.number}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          <View className="bg-orange-50 rounded-xl p-4">
            <Text className="text-center text-orange-800 font-medium">
              Keep solving questions daily to maintain your streak!
            </Text>
          </View>
        </Card>

        {/* Stats Overview */}
        <Card className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-6">Overview</Text>
          
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Total XP"
                value={xp}
                icon="trophy"
                iconColor={Colors.primary[500]}
                iconBackground={Colors.primary[50]}
              />
            </View>
            
            <View className="w-1/2 px-2 mb-4">
              <StatCard
                title="Quizzes Taken"
                value={quizHistory.length}
                icon="school"
                iconColor={Colors.accent.purple}
                iconBackground="#f3e8ff"
              />
            </View>
            
            <View className="w-1/2 px-2">
              <StatCard
                title="Current Level"
                value={level}
                icon="checkmark-circle"
                iconColor={Colors.status.success}
                iconBackground="#f0fdf4"
              />
            </View>
            
            <View className="w-1/2 px-2">
              <StatCard
                title="Day Streak"
                value={streak}
                icon="flame"
                iconColor={Colors.accent.orange}
                iconBackground="#fff7ed"
              />
            </View>
          </View>
        </Card>

        {/* Quiz History */}
        <Card className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quiz History</Text>
          
          {quizHistory.length === 0 ? (
            <View className="items-center py-8">
              <View className="bg-gray-100 rounded-full p-6 mb-4">
                <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-center font-medium">
                No quizzes completed yet.{'\n'}Start your first quiz to see your progress!
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {quizHistory.slice(0, 5).map((quiz, index) => (
                <View key={quiz.id} className="bg-gray-50 rounded-xl p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800">{quiz.subject}</Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {new Date(quiz.date).toLocaleDateString()}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                      <View className={`px-3 py-2 rounded-full border ${getScoreBadgeColor(quiz.score)}`}>
                        <Text className={`text-sm font-bold ${getScoreColor(quiz.score)}`}>
                          {quiz.score}%
                        </Text>
                      </View>
                      
                      <Text className="text-gray-400 ml-3 font-medium">
                        {quiz.questions.length} questions
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {quizHistory.length > 5 && (
                <Text className="text-center text-gray-500 mt-4 font-medium">
                  + {quizHistory.length - 5} more quizzes
                </Text>
              )}
            </View>
          )}
        </Card>

        {/* Upgrade CTA */}
        {!isPro && (
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl shadow-purple-500/25 mb-8">
            <View className="items-center">
              <View className="bg-white rounded-full p-4 mb-4">
                <Ionicons name="star" size={48} color="#8B5CF6" />
              </View>
              <Text className="text-white text-2xl font-bold">Upgrade to Pro</Text>
              <Text className="text-purple-100 text-center mt-2 mb-6 font-medium">
                Get unlimited solves, quizzes, and detailed analytics
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                className="bg-white rounded-2xl px-8 py-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-purple-500 font-bold text-lg">Upgrade Now</Text>
              </Pressable>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};