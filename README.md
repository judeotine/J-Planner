# J-Planner 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React_Native-0.72.0-61dafb?logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.8.4-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An AI-powered productivity companion that helps you organize tasks, track your mood, take notes, and gain insights into your daily routines. Built with React Native, TypeScript, and powered by AI for intelligent assistance.

<div align="center">
  <img src="assets/images/banner.png" alt="J-Planner Logo" width="200"/>
</div>

## Features

- **Task Management** - Create, organize, and track tasks with priorities and due dates
- **Journaling** - Record daily thoughts with mood tracking and prompts
- **Smart Notes** - Rich text notes with tagging and search functionality
- **AI Assistant** - Get insights and suggestions based on your data
- **Secure Access** - PIN and biometric authentication for privacy
- **Dark/Light Mode** - Beautiful UI with theme support
- **Offline First** - All your data is stored locally

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator or physical device

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/judeotine/J-Planner.git
   cd J-Planner
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Update the .env file with your OpenRouter API key
   ```

4. Start the development server
   ```bash
   npx expo start
   ```

## Built With

- **Frontend**: React Native, Expo Router
- **State Management**: React Context API
- **UI Components**: React Native Paper
- **Navigation**: Expo Router
- **Local Storage**: AsyncStorage
- **Authentication**: Expo SecureStore, Biometrics
- **AI Integration**: OpenRouter API
- **Type Safety**: TypeScript

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Jude Otine - [@judeotine](https://linkedin.com/in/judeotine) - judeotine@gmail.com

Project Link: [https://github.com/judeotine/J-Planner](https://github.com/judeotine/J-Planner)

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [OpenRouter](https://openrouter.ai/)
- All the amazing open-source libraries used in this project
