import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { GlassPane } from '../../components/ui/GlassPane';

const TRENDS = [
  {
    id: '1',
    title: 'Minimalist Mastery',
    subtitle: 'The Return of Architectural Basics',
    img: 'https://images.unsplash.com/photo-1539109132314-34a9366df917?auto=format&fit=crop&q=80',
    category: 'Inspiration'
  },
  {
    id: '2',
    title: 'Crimson Depth',
    subtitle: 'Decoding this Season’s Boldest Palette',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
    category: 'Trends'
  },
  {
    id: '3',
    title: 'Sustainable Silk',
    subtitle: 'The Future of Conscious Luxury',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    category: 'Editorial'
  },
  {
    id: '4',
    title: 'Evening Geometry',
    subtitle: 'Structural Gowns for the Modern Muse',
    img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80',
    category: 'Couture'
  },
];

export default function ExploreScreen() {
  const renderTrendItem = ({ item, index }: any) => (
    <Animated.View
      entering={FadeInDown.delay(index * 150).springify()}
      className="mb-8"
    >
      <TouchableOpacity activeOpacity={0.9} className="relative rounded-[48px] overflow-hidden border border-white/10 shadow-2xl">
        <Image
          source={{ uri: item.img }}
          className="w-full h-96"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30 bg-gradient-to-b from-transparent to-black/80" />

        <View className="absolute bottom-0 left-0 right-0 p-8">
          <View className="bg-aura-accent/20 self-start px-3 py-1 rounded-full border border-aura-accent/30 mb-4">
            <Text className="text-aura-accent text-[8px] font-bold uppercase tracking-[2px]">{item.category}</Text>
          </View>
          <Text className="text-aura-text text-3xl font-bold tracking-tight mb-2">{item.title}</Text>
          <Text className="text-aura-textDim text-sm tracking-wide">{item.subtitle}</Text>
        </View>

        <TouchableOpacity className="absolute top-8 right-8 w-12 h-12 rounded-full items-center justify-center bg-black/20 border border-white/20 backdrop-blur-md">
          <Ionicons name="bookmark-outline" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <CosmicBackground>
      <SafeAreaView className="flex-1">
        <View className="px-5 pt-4 mb-6">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-aura-accent text-[10px] font-bold uppercase tracking-[4px] mb-2">Curated Intelligence</Text>
              <Text className="text-aura-text text-4xl font-bold tracking-tighter">Style Journal</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 rounded-full items-center justify-center bg-white/5 border border-white/10">
              <Ionicons name="search" size={20} color="#705367" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={TRENDS}
          keyExtractor={(item) => item.id}
          renderItem={renderTrendItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          ListHeaderComponent={() => (
            <View className="mb-8">
              <GlassPane style={{ padding: 20, borderRadius: 32 }}>
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full bg-aura-primary/30 items-center justify-center border border-aura-primary/50">
                    <Ionicons name="sparkles" size={18} color="#CB7896" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-aura-text font-bold text-xs">AI EDITOR'S DAILY PICK</Text>
                    <Text className="text-aura-textDim text-[10px] tracking-wide mt-0.5">Updated 4 hours ago for your profile.</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#CB7896" />
                </View>
              </GlassPane>
            </View>
          )}
        />
      </SafeAreaView>
    </CosmicBackground>
  );
}
