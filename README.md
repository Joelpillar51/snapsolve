# SnapSolve 📱

**AI-powered student learning app with photo-based question solving and daily quizzes**

SnapSolve is a React Native mobile application designed to help students learn more effectively by providing instant AI-powered solutions to questions and engaging daily quizzes. Simply snap a photo of any question and get detailed step-by-step solutions!

## ✨ Features

### 🏠 Home Screen
- **User Progress Tracking**: XP system with levels and streaks
- **Quick Access**: Jump to camera solve or daily quiz
- **Daily Stats**: View today's usage and achievements
- **Subscription Management**: Free vs Pro plan indicators

### 📸 Solve Screen
- **Camera Integration**: Take photos of questions directly
- **Gallery Import**: Select existing images from your library
- **AI Analysis**: Get detailed solutions with explanations
- **Step-by-Step Breakdown**: Clear learning-focused explanations
- **Similar Questions**: Generate practice problems based on solved questions

### 🎯 Quiz Screen
- **Subject Selection**: Choose from 8 subjects (Math, Science, English, etc.)
- **AI-Generated Questions**: Dynamic multiple-choice questions
- **Immediate Feedback**: See correct answers and explanations
- **Progress Tracking**: Track quiz performance over time

### 📊 Progress Screen
- **Streak Calendar**: 7-day visual streak tracking
- **XP Progression**: Level-based achievement system
- **Quiz History**: View past quiz results and scores
- **Statistics Overview**: Comprehensive learning analytics

### 👤 Profile Screen
- **Avatar Customization**: Choose from 18 student/teacher avatars
- **Subscription Status**: Free vs Pro plan management
- **Usage Statistics**: Daily limits and current usage
- **Settings**: App preferences and support options

## 🚀 Technology Stack

- **Framework**: React Native 0.76.7 + Expo SDK 53
- **Navigation**: React Navigation 7 (Bottom Tabs)
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **AI Integration**: OpenAI GPT-4o for image analysis and text generation
- **Camera**: Expo Camera with permissions handling
- **Icons**: Expo Vector Icons (Ionicons)

## 💡 Key Components

### State Management
- **User Store**: XP, levels, streaks, subscription status
- **Quiz Store**: Current sessions, history, and results
- **Persistent Storage**: AsyncStorage for offline data retention

### AI Integration
- **Image Analysis**: Convert photos to AI-readable format
- **Question Solving**: Generate solutions with explanations
- **Quiz Generation**: Create subject-specific questions
- **Educational Focus**: Student-friendly explanations

### Subscription System
- **Free Plan**: 5 photo solves, 1 quiz per day
- **Pro Plan**: Unlimited solves and quizzes
- **Usage Tracking**: Daily limits with reset functionality

## 🎨 Design Philosophy

- **Student-Friendly**: Kid-appropriate UI with motivational elements
- **Apple HIG Compliance**: Native iOS design patterns
- **Accessibility**: Clear typography and intuitive navigation
- **Performance**: Smooth animations and responsive interactions

## 📱 Screenshots

*Note: Screenshots would be added here showing the main screens*

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Joelpillar51/snapsolve.git
   cd snapsolve
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   - API keys are pre-configured in the development environment
   - For production, add your OpenAI API key

4. **Run the app**:
   ```bash
   bun run start
   ```

## 🌟 Future Enhancements

- **Real-time Image Processing**: Full OpenAI API integration
- **Offline Mode**: Cached solutions for common questions
- **Social Features**: Share achievements and compete with friends
- **Advanced Analytics**: Detailed learning insights and recommendations
- **Multiple Languages**: Support for international students

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For support or questions, please contact: [Your Contact Information]

---

**Built with ❤️ for students everywhere**