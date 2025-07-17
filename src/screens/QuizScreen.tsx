import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../state/userStore';
import { useQuizStore, QuizQuestion } from '../state/quizStore';
import { getOpenAITextResponse } from '../api/chat-service';

const subjects = [
  { id: 'math', name: 'Mathematics', icon: 'calculator' },
  { id: 'science', name: 'Science', icon: 'flask' },
  { id: 'english', name: 'English', icon: 'book' },
  { id: 'history', name: 'History', icon: 'time' },
  { id: 'geography', name: 'Geography', icon: 'earth' },
  { id: 'physics', name: 'Physics', icon: 'nuclear' },
  { id: 'chemistry', name: 'Chemistry', icon: 'beaker' },
  { id: 'biology', name: 'Biology', icon: 'leaf' },
];

export const QuizScreen = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const insets = useSafeAreaInsets();
  
  const { useQuiz, incrementXP, isPro, dailyQuizzes } = useUserStore();
  const { 
    currentSession, 
    startQuiz, 
    answerQuestion, 
    nextQuestion, 
    completeQuiz, 
    clearCurrentSession 
  } = useQuizStore();

  const handleGenerateQuiz = async () => {
    if (!useQuiz()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have completed your daily quiz. Upgrade to Pro for unlimited quizzes!',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    
    try {
      const selectedSubjectName = subjects.find(s => s.id === selectedSubject)?.name || 'Mathematics';
      
      const prompt = `Generate a quiz with 5 multiple-choice questions about ${selectedSubjectName} suitable for students. 
      
      Return the response in this exact JSON format:
      {
        "questions": [
          {
            "id": "1",
            "question": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Explanation of why this is correct"
          }
        ]
      }
      
      Make sure:
      - Questions are educational and appropriate for students
      - Each question has exactly 4 options
      - correctAnswer is the index (0-3) of the correct option
      - Include clear explanations
      - Questions should be varied in difficulty (easy to medium)`;
      
      const response = await getOpenAITextResponse([{ role: 'user', content: prompt }]);
      
      const quizData = JSON.parse(response.content);
      
      if (quizData.questions && Array.isArray(quizData.questions)) {
        startQuiz(selectedSubjectName, quizData.questions);
      } else {
        throw new Error('Invalid quiz format received');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      Alert.alert('Error', 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!currentSession || showResult) return;
    
    setSelectedAnswer(answerIndex);
    answerQuestion(currentSession.currentQuestion, answerIndex);
  };

  const handleNextQuestion = () => {
    if (!currentSession) return;
    
    setShowResult(false);
    setSelectedAnswer(null);
    
    if (currentSession.currentQuestion < currentSession.questions.length - 1) {
      nextQuestion();
    } else {
      completeQuiz();
      incrementXP(20); // Award 20 XP for completing quiz
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleTryAgain = () => {
    clearCurrentSession();
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getCurrentQuestion = () => {
    if (!currentSession) return null;
    return currentSession.questions[currentSession.currentQuestion];
  };

  const getSelectedSubjectIcon = () => {
    const subject = subjects.find(s => s.id === selectedSubject);
    return subject?.icon || 'help';
  };

  // Quiz completion screen
  if (currentSession?.completed) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: insets.top + 20 }}
        >
          <View className="items-center mb-8">
            <View className="bg-green-100 rounded-full p-6 mb-4">
              <Ionicons name="trophy" size={64} color="#10B981" />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</Text>
            <Text className="text-xl text-gray-600">Your Score: {currentSession.score}%</Text>
          </View>

          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Results Summary</Text>
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subject:</Text>
                <Text className="font-medium">{currentSession.subject}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Questions:</Text>
                <Text className="font-medium">{currentSession.questions.length}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Correct Answers:</Text>
                <Text className="font-medium text-green-600">
                  {currentSession.answers.filter((answer, index) => 
                    answer === currentSession.questions[index].correctAnswer
                  ).length}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">XP Earned:</Text>
                <Text className="font-medium text-blue-600">+20 XP</Text>
              </View>
            </View>
          </View>

          <View className="space-y-4">
            <Pressable
              onPress={handleTryAgain}
              className="bg-blue-500 rounded-xl p-4 active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Try Another Quiz
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active quiz screen
  if (currentSession && !currentSession.completed) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: insets.top + 20 }}
        >
          {/* Progress Header */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">
                Question {currentSession.currentQuestion + 1} of {currentSession.questions.length}
              </Text>
              <Text className="text-sm text-gray-600">{currentSession.subject}</Text>
            </View>
            
            <View className="bg-gray-200 rounded-full h-2">
              <View 
                className="bg-blue-500 rounded-full h-2"
                style={{ 
                  width: `${((currentSession.currentQuestion + 1) / currentSession.questions.length) * 100}%` 
                }}
              />
            </View>
          </View>

          {/* Question */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </Text>
          </View>

          {/* Answer Options */}
          <View className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrong = showResult && isSelected && !isCorrect;
              
              let buttonClass = "bg-white border-2 border-gray-200 rounded-xl p-4 active:scale-95";
              let textClass = "text-gray-800 font-medium";
              
              if (showResult && isCorrect) {
                buttonClass = "bg-green-50 border-2 border-green-500 rounded-xl p-4";
                textClass = "text-green-800 font-medium";
              } else if (isWrong) {
                buttonClass = "bg-red-50 border-2 border-red-500 rounded-xl p-4";
                textClass = "text-red-800 font-medium";
              } else if (isSelected) {
                buttonClass = "bg-blue-50 border-2 border-blue-500 rounded-xl p-4 active:scale-95";
                textClass = "text-blue-800 font-medium";
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  style={{ transform: [{ scale: 1 }] }}
                  disabled={showResult}
                >
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 rounded-full border-2 border-gray-400 mr-3 items-center justify-center">
                      <Text className="text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text className={textClass}>{option}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Explanation (shown after answer) */}
          {showResult && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <Text className="text-lg font-semibold text-yellow-800 mb-2">Explanation</Text>
              <Text className="text-yellow-700">{currentQuestion.explanation}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            {selectedAnswer !== null && !showResult && (
              <Pressable
                onPress={handleShowResult}
                className="bg-blue-500 rounded-xl p-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Check Answer
                </Text>
              </Pressable>
            )}
            
            {showResult && (
              <Pressable
                onPress={handleNextQuestion}
                className="bg-green-500 rounded-xl p-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {currentSession.currentQuestion < currentSession.questions.length - 1 
                    ? 'Next Question' 
                    : 'Complete Quiz'}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz setup screen
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-purple-100 rounded-full p-4 mb-4">
            <Ionicons name="school" size={48} color="#8B5CF6" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Daily Quiz</Text>
          <Text className="text-gray-600 mt-1 text-center">
            Test your knowledge with AI-generated questions
          </Text>
        </View>

        {/* Usage Counter */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">Today's Quizzes</Text>
            <Text className="text-2xl font-bold text-purple-500">
              {dailyQuizzes}/{isPro ? '∞' : '1'}
            </Text>
          </View>
          {!isPro && dailyQuizzes >= 1 && (
            <Text className="text-red-500 text-sm mt-2">
              Daily limit reached. Upgrade to Pro for unlimited quizzes!
            </Text>
          )}
        </View>

        {/* Subject Selection */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Choose Subject</Text>
          <View className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Pressable
                key={subject.id}
                onPress={() => setSelectedSubject(subject.id)}
                className={`p-4 rounded-xl border-2 active:scale-95 ${
                  selectedSubject === subject.id
                    ? 'bg-purple-50 border-purple-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
                style={{ transform: [{ scale: 1 }] }}
              >
                <View className="items-center">
                  <Ionicons 
                    name={subject.icon as any} 
                    size={32} 
                    color={selectedSubject === subject.id ? '#8B5CF6' : '#6B7280'} 
                  />
                  <Text className={`mt-2 font-medium ${
                    selectedSubject === subject.id ? 'text-purple-800' : 'text-gray-700'
                  }`}>
                    {subject.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Generate Quiz Button */}
        <View className="mb-8">
          {loading ? (
            <View className="bg-white rounded-xl p-8 shadow-sm items-center">
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text className="text-lg font-semibold text-gray-800 mt-4">
                Generating Quiz...
              </Text>
              <Text className="text-gray-600 mt-2 text-center">
                Creating 5 questions about {subjects.find(s => s.id === selectedSubject)?.name}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={handleGenerateQuiz}
              className="bg-purple-500 rounded-2xl p-6 shadow-lg active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name={getSelectedSubjectIcon() as any} size={32} color="white" />
                <Text className="text-white text-xl font-bold ml-3">Generate Quiz</Text>
              </View>
              <Text className="text-purple-100 text-center mt-2">
                5 questions about {subjects.find(s => s.id === selectedSubject)?.name}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};