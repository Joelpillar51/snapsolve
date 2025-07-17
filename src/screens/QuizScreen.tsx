import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../state/userStore';
import { useQuizStore, QuizQuestion } from '../state/quizStore';
import { getOpenAITextResponse } from '../api/chat-service';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Colors } from '../constants/Colors';

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
    const correctAnswers = currentSession.answers.filter((answer, index) => 
      answer === currentSession.questions[index].correctAnswer
    ).length;
    
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background.primary }}>
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: insets.top + 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <View className="bg-green-100 rounded-full p-8 mb-6 shadow-lg">
              <Ionicons name="trophy" size={72} color={Colors.primary[600]} />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</Text>
            <Text className="text-2xl text-green-600 font-semibold">
              Your Score: {currentSession.score}%
            </Text>
          </View>

          <Card className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Results Summary</Text>
            <View className="space-y-4">
              <View className="bg-blue-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-medium">Subject:</Text>
                  <Text className="font-bold text-blue-600">{currentSession.subject}</Text>
                </View>
              </View>
              <View className="bg-purple-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-medium">Questions:</Text>
                  <Text className="font-bold text-purple-600">{currentSession.questions.length}</Text>
                </View>
              </View>
              <View className="bg-green-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-medium">Correct Answers:</Text>
                  <Text className="font-bold text-green-600">{correctAnswers}</Text>
                </View>
              </View>
              <View className="bg-amber-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-medium">XP Earned:</Text>
                  <Text className="font-bold text-amber-600">+20 XP</Text>
                </View>
              </View>
            </View>
          </Card>

          <Button
            title="Try Another Quiz"
            onPress={handleTryAgain}
            icon="refresh"
            size="large"
            className="bg-green-500 shadow-xl shadow-green-500/25"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active quiz screen
  if (currentSession && !currentSession.completed) {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background.primary }}>
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: insets.top + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Header */}
          <Card className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Question {currentSession.currentQuestion + 1} of {currentSession.questions.length}
              </Text>
              <View className="bg-green-100 rounded-full px-3 py-1">
                <Text className="text-sm font-semibold text-green-700">{currentSession.subject}</Text>
              </View>
            </View>
            
            <ProgressBar 
              progress={(currentSession.currentQuestion + 1) / currentSession.questions.length}
              color={Colors.primary[500]}
              backgroundColor={Colors.primary[100]}
              height={12}
            />
          </Card>

          {/* Question */}
          <Card className="mb-6">
            <View className="flex-row items-start">
              <View className="bg-green-100 rounded-full p-2 mr-4">
                <Ionicons name="help-circle" size={24} color={Colors.primary[600]} />
              </View>
              <Text className="text-xl font-semibold text-gray-800 leading-relaxed flex-1">
                {currentQuestion.question}
              </Text>
            </View>
          </Card>

          {/* Answer Options */}
          <View className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const isWrong = showResult && isSelected && !isCorrect;
              
              let buttonClass = "bg-white border-2 border-gray-200 rounded-2xl p-5 active:scale-95";
              let textClass = "text-gray-800 font-medium";
              let optionLetter = String.fromCharCode(65 + index);
              let letterBg = "bg-gray-200";
              let letterColor = "text-gray-700";
              
              if (showResult && isCorrect) {
                buttonClass = "bg-green-50 border-2 border-green-500 rounded-2xl p-5";
                textClass = "text-green-800 font-medium";
                letterBg = "bg-green-500";
                letterColor = "text-white";
              } else if (isWrong) {
                buttonClass = "bg-red-50 border-2 border-red-500 rounded-2xl p-5";
                textClass = "text-red-800 font-medium";
                letterBg = "bg-red-500";
                letterColor = "text-white";
              } else if (isSelected) {
                buttonClass = "bg-blue-50 border-2 border-blue-500 rounded-2xl p-5 active:scale-95";
                textClass = "text-blue-800 font-medium";
                letterBg = "bg-blue-500";
                letterColor = "text-white";
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
                    <View className={`w-8 h-8 rounded-full mr-4 items-center justify-center ${letterBg}`}>
                      <Text className={`font-bold ${letterColor}`}>
                        {optionLetter}
                      </Text>
                    </View>
                    <Text className={`${textClass} flex-1`}>{option}</Text>
                    {showResult && isCorrect && (
                      <Ionicons name="checkmark-circle" size={24} color={Colors.status.success} />
                    )}
                    {isWrong && (
                      <Ionicons name="close-circle" size={24} color={Colors.status.error} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Explanation (shown after answer) */}
          {showResult && (
            <Card className="bg-amber-50 border-2 border-amber-200 mb-6">
              <View className="flex-row items-start">
                <View className="bg-amber-500 rounded-full p-2 mr-4">
                  <Ionicons name="bulb" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-amber-800 mb-2">Explanation</Text>
                  <Text className="text-amber-700 leading-relaxed">{currentQuestion.explanation}</Text>
                </View>
              </View>
            </Card>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            {selectedAnswer !== null && !showResult && (
              <Button
                title="Check Answer"
                onPress={handleShowResult}
                icon="checkmark-circle"
                size="large"
                className="bg-blue-500 shadow-xl shadow-blue-500/25"
              />
            )}
            
            {showResult && (
              <Button
                title={currentSession.currentQuestion < currentSession.questions.length - 1 
                  ? 'Next Question' 
                  : 'Complete Quiz'}
                onPress={handleNextQuestion}
                icon="arrow-forward"
                size="large"
                className="bg-green-500 shadow-xl shadow-green-500/25"
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz setup screen
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
            <Ionicons name="school" size={56} color={Colors.primary[600]} />
          </View>
          <Text className="text-3xl font-bold text-gray-800">Daily Quiz</Text>
          <Text className="text-gray-600 mt-2 text-center font-medium">
            Test your knowledge with AI-generated questions
          </Text>
        </View>

        {/* Usage Counter */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">Today's Quizzes</Text>
              <Text className="text-gray-600 mt-1">
                {!isPro && dailyQuizzes >= 1 ? 'Daily limit reached' : 'Keep learning!'}
              </Text>
            </View>
            <View className="bg-green-100 rounded-full px-4 py-2">
              <Text className="text-2xl font-bold text-green-600">
                {dailyQuizzes}/{isPro ? '∞' : '1'}
              </Text>
            </View>
          </View>
          {!isPro && dailyQuizzes >= 1 && (
            <View className="bg-red-50 rounded-xl p-3 mt-4">
              <Text className="text-red-600 text-sm font-medium text-center">
                Daily limit reached. Upgrade to Pro for unlimited quizzes!
              </Text>
            </View>
          )}
        </Card>

        {/* Subject Selection */}
        <Card className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Choose Subject</Text>
          <View className="flex-row flex-wrap">
            {subjects.map((subject) => (
              <Pressable
                key={subject.id}
                onPress={() => setSelectedSubject(subject.id)}
                className={`w-40 p-4 rounded-2xl border-2 active:scale-95 m-1 ${
                  selectedSubject === subject.id
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
                style={{ transform: [{ scale: 1 }] }}
              >
                <View className="items-center">
                  <Ionicons 
                    name={subject.icon as any} 
                    size={32} 
                    color={selectedSubject === subject.id ? Colors.primary[600] : '#6B7280'} 
                  />
                  <Text className={`mt-2 font-medium ${
                    selectedSubject === subject.id ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {subject.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Generate Quiz Button */}
        <View className="mb-8">
          {loading ? (
            <Card className="items-center py-8">
              <View className="bg-green-100 rounded-full p-4 mb-4">
                <ActivityIndicator size="large" color={Colors.primary[600]} />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Generating Quiz...
              </Text>
              <Text className="text-gray-600 text-center">
                Creating 5 questions about {subjects.find(s => s.id === selectedSubject)?.name}
              </Text>
            </Card>
          ) : (
            <Button
              title="Generate Quiz"
              onPress={handleGenerateQuiz}
              icon={getSelectedSubjectIcon() as any}
              size="large"
              className="bg-green-500 shadow-xl shadow-green-500/25"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};