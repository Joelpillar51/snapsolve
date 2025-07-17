import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../state/userStore';
import { getOpenAITextResponse } from '../api/chat-service';
import { AIMessage } from '../types/ai';

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
      const photo = await cameraRef.current.takePicture({
        quality: 0.8,
        base64: true,
      });
      
      setCapturedImage(photo.uri);
      setShowCamera(false);
      await solveQuestion(photo.uri);
    }
  };

  const solveQuestion = async (imageUri: string) => {
    setLoading(true);
    setSolution(null);
    
    try {
      const messages: AIMessage[] = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and solve the question or problem shown. Provide your response in the following JSON format:\n\n{\n  "answer": "The final answer or solution",\n  "explanation": "A clear explanation of the solution",\n  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]\n}\n\nMake sure to provide step-by-step working for mathematical problems or detailed explanations for other subjects. Keep the language student-friendly and educational.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUri,
              },
            },
          ],
        },
      ];

      const response = await getOpenAITextResponse(messages);
      
      try {
        const parsedSolution = JSON.parse(response.content);
        setSolution(parsedSolution);
        incrementXP(10); // Award 10 XP for each solve
      } catch (parseError) {
        // Fallback if JSON parsing fails
        setSolution({
          answer: 'Solution generated',
          explanation: response.content,
          steps: ['Please check the explanation above for detailed steps.'],
        });
        incrementXP(10);
      }
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: insets.top + 20 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-blue-100 rounded-full p-4 mb-4">
            <Ionicons name="camera" size={48} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Solve Questions</Text>
          <Text className="text-gray-600 mt-1 text-center">
            Take a photo of any question and get instant solutions
          </Text>
        </View>

        {/* Usage Counter */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">Today's Solves</Text>
            <Text className="text-2xl font-bold text-blue-500">
              {dailySolves}/{isPro ? '∞' : '5'}
            </Text>
          </View>
          {!isPro && dailySolves >= 5 && (
            <Text className="text-red-500 text-sm mt-2">
              Daily limit reached. Upgrade to Pro for unlimited solves!
            </Text>
          )}
        </View>

        {/* Main Action Buttons */}
        {!capturedImage && !solution && (
          <View className="space-y-4 mb-8">
            <Pressable
              onPress={handleTakePhoto}
              className="bg-blue-500 rounded-2xl p-6 shadow-lg active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="camera" size={32} color="white" />
                <Text className="text-white text-xl font-bold ml-3">Take a Photo</Text>
              </View>
              <Text className="text-blue-100 text-center mt-2">
                Point your camera at any question
              </Text>
            </Pressable>

            <Pressable
              onPress={handlePickImage}
              className="bg-purple-500 rounded-2xl p-6 shadow-lg active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="images" size={32} color="white" />
                <Text className="text-white text-xl font-bold ml-3">Choose from Gallery</Text>
              </View>
              <Text className="text-purple-100 text-center mt-2">
                Select an image from your photos
              </Text>
            </Pressable>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View className="bg-white rounded-xl p-8 shadow-sm items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-lg font-semibold text-gray-800 mt-4">
              Solving your question...
            </Text>
            <Text className="text-gray-600 mt-2 text-center">
              Please wait while we analyze the image
            </Text>
          </View>
        )}

        {/* Captured Image */}
        {capturedImage && !loading && (
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Captured Image</Text>
            <Image
              source={{ uri: capturedImage }}
              className="w-full h-48 rounded-lg"
              resizeMode="contain"
            />
          </View>
        )}

        {/* Solution Display */}
        {solution && !loading && (
          <View className="space-y-4 mb-8">
            {/* Answer */}
            <View className="bg-green-50 border border-green-200 rounded-xl p-4">
              <Text className="text-lg font-bold text-green-800 mb-2">Answer</Text>
              <Text className="text-green-700 text-lg">{solution.answer}</Text>
            </View>

            {/* Explanation */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Text className="text-lg font-bold text-blue-800 mb-2">Explanation</Text>
              <Text className="text-blue-700 leading-relaxed">{solution.explanation}</Text>
            </View>

            {/* Steps */}
            {solution.steps && solution.steps.length > 0 && (
              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <Text className="text-lg font-bold text-yellow-800 mb-2">Step-by-Step</Text>
                {solution.steps.map((step, index) => (
                  <Text key={index} className="text-yellow-700 mb-2">
                    {step}
                  </Text>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <Pressable
                onPress={generateSimilarQuestion}
                className="flex-1 bg-purple-500 rounded-xl p-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-white text-center font-semibold">
                  Try Similar Question
                </Text>
              </Pressable>
              
              <Pressable
                onPress={resetSolve}
                className="flex-1 bg-gray-500 rounded-xl p-4 active:scale-95"
                style={{ transform: [{ scale: 1 }] }}
              >
                <Text className="text-white text-center font-semibold">
                  Solve Another
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};