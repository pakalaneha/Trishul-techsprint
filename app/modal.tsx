import { Link } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { CosmicBackground } from '../components/ui/CosmicBackground';

export default function ModalScreen() {
  return (
    <CosmicBackground>
      <View className="flex-1 items-center justify-center p-5">
        <ThemedText type="title" className="text-white">Aura Intelligence</ThemedText>
        <Link href="/" dismissTo className="mt-8 py-4">
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </View>
    </CosmicBackground>
  );
}
