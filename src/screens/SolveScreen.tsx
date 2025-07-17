import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useUserStore } from '../state/userStore';
import { getOpenAITextResponse } from '../api/chat-service';
import { AIMessage } from '../types/ai';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Colors } from '../constants/Colors';

interface SolutionResponse {
  answer: string;
  explanation: string;
  steps: string[];
}

export const SolveScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  
  const { useSolve, incrementXP, isPro, dailySolves } = useUserStore();

  const handleTakePhoto = async () => {
    if (!useSolve()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 5 photo solves. Upgrade to Pro for unlimited solves!',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!permission) {
      await requestPermission();
      return;
    }

    if (!permission.granted) {
      Alert.alert(
        'Camera Permission',
        'We need camera access to scan your questions.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestPermission },
        ]
      );
      return;
    }

    setShowCamera(true);
    setSolution(null);
  };

  const handlePickImage = async () => {
    if (!useSolve()) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of 5 photo solves. Upgrade to Pro for unlimited solves!',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setShowCamera(false);
      await solveQuestion(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePicture({
          quality: 0.8,
          base64: true,
        });
        
        setCapturedImage(photo.uri);
        setShowCamera(false);
        await solveQuestion(photo.uri);
      } catch (error) {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const solveQuestion = async (imageUri: string) => {
    setLoading(true);
    setSolution(null);
    
    try {
      // For demo purposes, provide a mock solution
      // In a real app, you would convert the image to base64 and send to OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      const mockSolution = {
        answer: "x = 4",
        explanation: "This is a sample solution for demonstration purposes. In the real app, this would be the AI-generated solution based on the image analysis.",
        steps: [
          "Step 1: Identify the equation or problem from the image",
          "Step 2: Apply the appropriate mathematical principles",
          "Step 3: Solve step by step to find the answer"
        ]
      };
      
      setSolution(mockSolution);
      incrementXP(10); // Award 10 XP for each solve
    } catch (error) {
      console.error('Error solving question:', error);
      Alert.alert('Error', 'Failed to solve the question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSimilarQuestion = async () => {
    if (!solution) return;
    
    setLoading(true);
    
    try {
      const prompt = `Based on this solved problem: "${solution.answer}" with explanation: "${solution.explanation}", generate a similar question that tests the same concept but with different numbers/context. Provide the response in this JSON format:
      
      {
        "question": "The new similar question",
        "answer": "The answer to the new question",
        "explanation": "Step-by-step explanation",
        "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
      }`;
      
      const response = await getOpenAITextResponse([{ role: 'user', content: prompt }]);
      
      try {
        const newQuestion = JSON.parse(response.content);
        setSolution(newQuestion);
        setCapturedImage(null);
        incrementXP(5); // Award 5 XP for similar questions
      } catch (parseError) {
        Alert.alert('Error', 'Failed to generate similar question. Please try again.');
      }
    } catch (error) {
      console.error('Error generating similar question:', error);
      Alert.alert('Error', 'Failed to generate similar question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSolve = () => {
    setCapturedImage(null);
    setSolution(null);
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          enableTorch={flash}
        >
          <View className="absolute top-0 left-0 right-0 bottom-0 z-10">
            <SafeAreaView className="flex-1">
              {/* Top Controls */}
              <View className="flex-row justify-between items-center px-6 py-4">
                <Pressable
                  onPress={() => setShowCamera(false)}
                  className="bg-black/50 rounded-full p-3"
                >
                  <Ionicons name="close" size={24} color="white" />
                </Pressable>
                
                <Pressable
                  onPress={() => setFlash(!flash)}
                  className="bg-black/50 rounded-full p-3"
                >
                  <Ionicons name={flash ? 'flash' : 'flash-off'} size={24} color="white" />
                </Pressable>
              </View>

              {/* Bottom Controls */}
              <View className="absolute bottom-0 left-0 right-0 pb-8">
                <View className="flex-row justify-center items-center space-x-8">
                  <Pressable
                    onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
                    className="bg-black/50 rounded-full p-4"
                  >
                    <Ionicons name="camera-reverse" size={28} color="white" />
                  </Pressable>
                  
                  <Pressable
                    onPress={takePicture}
                    className="bg-white rounded-full p-4 border-4 border-gray-300"
                  >
                    <View className="w-16 h-16 bg-transparent" />
                  </Pressable>
                  
                  <View className="w-16 h-16" />
                </View>
              </View>
            </SafeAreaView>
          </View>
        </CameraView>
      </View>
    );
  }

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
            <Ionicons name="camera" size={56} color={Colors.primary[600]} />
          </View>
          <Text className="text-3xl font-bold text-gray-800">Solve Questions</Text>
          <Text className="text-gray-600 mt-2 text-center font-medium">
            Snap a photo and get instant AI-powered solutions
          </Text>
        </View>

        {/* Usage Counter */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">Today's Solves</Text>
              <Text className="text-gray-600 mt-1">
                {!isPro && dailySolves >= 5 ? 'Daily limit reached' : 'Keep learning!'}
              </Text>
            </View>
            <View className="bg-green-100 rounded-full px-4 py-2">
              <Text className="text-2xl font-bold text-green-600">
                {dailySolves}/{isPro ? '∞' : '5'}
              </Text>
            </View>
          </View>
          {!isPro && dailySolves >= 5 && (
            <View className="bg-red-50 rounded-xl p-3 mt-4">
              <Text className="text-red-600 text-sm font-medium text-center">
                Daily limit reached. Upgrade to Pro for unlimited solves!
              </Text>
            </View>
          )}
        </Card>

        {/* Main Action Buttons */}
        {!capturedImage && !solution && (
          <View className="space-y-4 mb-8">
            <Button
              title="Take a Photo"
              onPress={handleTakePhoto}
              icon="camera"
              size="large"
              className="bg-green-500 shadow-xl shadow-green-500/25"
            />

            <Button
              title="Choose from Gallery"
              onPress={handlePickImage}
              icon="images"
              size="large"
              variant="secondary"
              className="border-green-500 bg-green-50 shadow-xl shadow-green-500/10"
            />
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="items-center py-8">
            <View className="bg-green-100 rounded-full p-4 mb-4">
              <ActivityIndicator size="large" color={Colors.primary[600]} />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Solving your question...
            </Text>
            <Text className="text-gray-600 text-center">
              Our AI is analyzing the image and preparing a detailed solution
            </Text>
          </Card>
        )}

        {/* Captured Image */}
        {capturedImage && !loading && (
          <Card className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Your Question</Text>
            <View className="bg-gray-50 rounded-xl p-2">
              <Image
                source={{ uri: capturedImage }}
                className="w-full h-48 rounded-lg"
                resizeMode="contain"
              />
            </View>
          </Card>
        )}

        {/* Solution Display */}
        {solution && !loading && (
          <View className="space-y-4 mb-8">
            {/* Answer */}
            <Card className="bg-green-50 border-2 border-green-200">
              <View className="flex-row items-center mb-3">
                <View className="bg-green-500 rounded-full p-2 mr-3">
                  <Ionicons name="checkmark" size={20} color="white" />
                </View>
                <Text className="text-xl font-bold text-green-800">Answer</Text>
              </View>
              <Text className="text-green-700 text-lg font-semibold">{solution.answer}</Text>
            </Card>

            {/* Explanation */}
            <Card className="bg-blue-50 border-2 border-blue-200">
              <View className="flex-row items-center mb-3">
                <View className="bg-blue-500 rounded-full p-2 mr-3">
                  <Ionicons name="bulb" size={20} color="white" />
                </View>
                <Text className="text-xl font-bold text-blue-800">Explanation</Text>
              </View>
              <Text className="text-blue-700 leading-relaxed">{solution.explanation}</Text>
            </Card>

            {/* Steps */}
            {solution.steps && solution.steps.length > 0 && (
              <Card className="bg-amber-50 border-2 border-amber-200">
                <View className="flex-row items-center mb-3">
                  <View className="bg-amber-500 rounded-full p-2 mr-3">
                    <Ionicons name="list" size={20} color="white" />
                  </View>
                  <Text className="text-xl font-bold text-amber-800">Step-by-Step</Text>
                </View>
                {solution.steps.map((step, index) => (
                  <View key={index} className="flex-row items-start mb-3">
                    <View className="bg-amber-500 rounded-full w-6 h-6 items-center justify-center mr-3 mt-1">
                      <Text className="text-white text-xs font-bold">{index + 1}</Text>
                    </View>
                    <Text className="text-amber-700 flex-1">{step}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <Button
                title="Try Similar Question"
                onPress={generateSimilarQuestion}
                icon="refresh"
                variant="secondary"
                className="flex-1 border-purple-500 bg-purple-50"
              />
              
              <Button
                title="Solve Another"
                onPress={resetSolve}
                icon="add"
                variant="outline"
                className="flex-1 border-gray-500"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};