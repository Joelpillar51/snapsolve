import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../state/userStore';
import { useQuizStore } from '../state/quizStore';

export const ProgressScreen = () => {
  const navigation = useNavigation();
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-green-100 rounded-full p-4 mb-4">
            <Ionicons name="stats-chart" size={48} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Your Progress</Text>
          <Text className="text-gray-600 mt-1 text-center">
            Track your learning journey
          </Text>
        </View>

        {/* Level Progress */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-gray-800">Level {level}</Text>
            <Text className="text-gray-600 mt-1">{xp} Total XP</Text>
          </View>
          
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Progress to Level {level + 1}
              </Text>
              <Text className="text-sm text-gray-500">
                {xp % 100}/{xpForNextLevel}
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-4">
              <View 
                className="bg-green-500 rounded-full h-4"
                style={{ width: `${xpProgress * 100}%` }}
              />
            </View>
          </View>
          
          <View className="bg-green-50 rounded-lg p-4">
            <Text className="text-green-800 font-medium text-center">
              {Math.round((1 - xpProgress) * 100)} XP until next level!
            </Text>
          </View>
        </View>

        {/* Streak Calendar */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">Daily Streak</Text>
            <View className="flex-row items-center">
              <Ionicons name="flame" size={24} color="#FB923C" />
              <Text className="text-xl font-bold text-orange-500 ml-2">{streak}</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between">
            {getStreakCalendar().map((day, index) => (
              <View key={index} className="items-center">
                <Text className="text-xs text-gray-600 mb-2">{day.day}</Text>
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  day.isActive 
                    ? 'bg-orange-500' 
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
          
          <Text className="text-center text-gray-600 mt-4">
            Keep solving questions daily to maintain your streak!
          </Text>
        </View>

        {/* Stats Overview */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Overview</Text>
          
          <View className="flex-row flex-wrap">
            <View className="w-1/2 p-1">
              <View className="bg-blue-50 rounded-lg p-4 items-center">
                <Ionicons name="trophy" size={32} color="#3B82F6" />
                <Text className="text-2xl font-bold text-blue-600 mt-2">{xp}</Text>
                <Text className="text-blue-600 text-sm">Total XP</Text>
              </View>
            </View>
            
            <View className="w-1/2 p-1">
              <View className="bg-purple-50 rounded-lg p-4 items-center">
                <Ionicons name="school" size={32} color="#8B5CF6" />
                <Text className="text-2xl font-bold text-purple-600 mt-2">{quizHistory.length}</Text>
                <Text className="text-purple-600 text-sm">Quizzes Taken</Text>
              </View>
            </View>
            
            <View className="w-1/2 p-1">
              <View className="bg-green-50 rounded-lg p-4 items-center">
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text className="text-2xl font-bold text-green-600 mt-2">{level}</Text>
                <Text className="text-green-600 text-sm">Current Level</Text>
              </View>
            </View>
            
            <View className="w-1/2 p-1">
              <View className="bg-orange-50 rounded-lg p-4 items-center">
                <Ionicons name="flame" size={32} color="#FB923C" />
                <Text className="text-2xl font-bold text-orange-600 mt-2">{streak}</Text>
                <Text className="text-orange-600 text-sm">Day Streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quiz History */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quiz History</Text>
          
          {quizHistory.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">
                No quizzes completed yet.{'\n'}Start your first quiz to see your progress!
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {quizHistory.slice(0, 5).map((quiz, index) => (
                <View key={quiz.id} className="flex-row items-center justify-between py-3 border-b border-gray-100">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">{quiz.subject}</Text>
                    <Text className="text-sm text-gray-600">
                      {new Date(quiz.date).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className={`px-3 py-1 rounded-full border ${getScoreBadgeColor(quiz.score)}`}>
                      <Text className={`text-sm font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}%
                      </Text>
                    </View>
                    
                    <Text className="text-gray-400 ml-3">
                      {quiz.questions.length} questions
                    </Text>
                  </View>
                </View>
              ))}
              
              {quizHistory.length > 5 && (
                <Text className="text-center text-gray-500 mt-4">
                  + {quizHistory.length - 5} more quizzes
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Upgrade CTA */}
        {!isPro && (
          <View className="bg-purple-500 rounded-xl p-6 shadow-lg mb-8">
            <View className="items-center">
              <Ionicons name="star" size={48} color="white" />
              <Text className="text-white text-xl font-bold mt-2">Upgrade to Pro</Text>
              <Text className="text-purple-100 text-center mt-2 mb-4">
                Get unlimited solves, quizzes, and detailed analytics
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Profile' as never)}
                className="bg-white rounded-full px-8 py-3 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-purple-500 font-bold text-lg">Upgrade Now</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};