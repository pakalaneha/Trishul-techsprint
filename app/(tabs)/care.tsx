import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { GlassPane } from '../../components/ui/GlassPane';
import { NeoButton } from '../../components/ui/NeoButton';
import { AIService } from '../../services/aiService';
import { useAuth } from '../../services/authStore';

export default function SkinCareScreen() {
    const router = useRouter();
    const user = useAuth((state) => state.user);
    const [analyzing, setAnalyzing] = useState(false);
    const [step, setStep] = useState(1); // 1: Vision, 2: Quiz, 3: Result
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<{
        label: string;
        confidence: number;
        description: string;
        isClear: boolean;
        recommendations?: any;
    } | null>(null);

    // Quiz State
    const [skinType, setSkinType] = useState('');
    const [concern, setConcern] = useState('');
    const [sensitivity, setSensitivity] = useState('');

    const luxurySpring = (delay: number) => FadeInUp.mass(0.5).damping(18).stiffness(120).delay(delay);

    const handleAnalyze = async () => {
        if (!uploadedImage) return;
        setAnalyzing(true);
        try {
            const result = await AIService.analyzeSkin(uploadedImage);
            const recommendations = AIService.getSkinRecommendations(result.label);

            setAnalysisResult({
                ...result,
                recommendations
            });

            // result is persisted in the backend by AIService/FlaskApiService
            // but we can also update local state
            // setUser({ ...user, skin_type: result.label });
        } catch (error: any) {
            console.error(error);
            Alert.alert('Analysis failed', error.message || 'Could not complete skin analysis.');
        } finally {
            setAnalyzing(false);
            setStep(3);
        }
    };

    const handleUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Aura needs access to your gallery to analyze skin.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                const localUri = result.assets[0].uri;
                // Skip Firebase upload - use local URI directly for AI analysis
                setUploadedImage(localUri);
            }
        } catch (error) {
            console.error("Gallery Error:", error);
            setAnalyzing(false);
            Alert.alert('Upload Error', 'Failed to select image.');
        }
    };

    const handleCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Aura needs camera access to take a photo.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                const localUri = result.assets[0].uri;
                // Skip Firebase upload - use local URI directly for AI analysis
                setUploadedImage(localUri);
            }
        } catch (error) {
            console.error("Camera Error:", error);
            setAnalyzing(false);
            Alert.alert('Camera Error', 'Failed to capture image.');
        }
    };

    const ResultView = () => {
        const [activeRoutine, setActiveRoutine] = useState<'AM' | 'PM'>('AM');

        const indicators = [
            { label: 'Hydration', value: 89, color: '#CB7896' },
            { label: 'AI Confidence', value: analysisResult?.confidence || 0, color: '#CB7896' },
            { label: 'Elasticity', value: 82, color: '#CB7896' },
        ];

        const recs = analysisResult?.recommendations;
        const products = recs?.products || [
            { name: 'Velvet Cloud Cleanser', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1556227702-d1e4e7ca5c23?auto=format&fit=crop&q=80' },
            { name: 'Rose Quartz Serum', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80' },
        ];

        return (
            <Animated.View entering={luxurySpring(100)} className="flex-1">
                <View className="mb-8">
                    <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-2">Analysis Complete</Text>
                    <Text className="text-aura-text text-3xl font-bold tracking-tight">Your Skin Synthesis</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                    {/* Diagnosis Summary */}
                    <View className="bg-white/5 border border-white/10 p-8 rounded-[48px] mb-8">
                        <View className="flex-row items-center mb-6">
                            <View className="w-12 h-12 rounded-full bg-aura-primary/20 items-center justify-center mr-4">
                                <Ionicons name="finger-print" size={24} color="#CB7896" />
                            </View>
                            <View>
                                <Text className="text-aura-textDim text-[10px] uppercase tracking-widest font-bold">Aura Detection</Text>
                                <Text className="text-aura-accent text-lg font-bold uppercase">{analysisResult?.label || skinType || 'Vibrant'}</Text>
                            </View>
                        </View>
                        <Text className="text-aura-text leading-7 text-sm font-medium italic">
                            "{analysisResult?.description} Your profile suggests a focus on {concern.toLowerCase()} management and optimizing cellular turnover."
                        </Text>
                    </View>

                    {/* Indicators */}
                    <View className="flex-row gap-4 mb-8">
                        {indicators.map((ind, i) => (
                            <View key={i} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-[32px] items-center">
                                <Text className="text-aura-textDim text-[8px] uppercase tracking-widest mb-1">{ind.label}</Text>
                                <Text className="text-aura-text text-lg font-bold">{ind.value}%</Text>
                            </View>
                        ))}
                    </View>

                    {/* Ritual Selector */}
                    <View className="flex-row mb-6 bg-white/5 rounded-full p-1 border border-white/10">
                        {['AM', 'PM'].map((r) => (
                            <TouchableOpacity
                                key={r}
                                onPress={() => setActiveRoutine(r as any)}
                                className={`flex-1 py-3 rounded-full items-center ${activeRoutine === r ? 'bg-aura-primary' : ''}`}
                            >
                                <Text className={`font-bold text-[10px] tracking-widest uppercase ${activeRoutine === r ? 'text-aura-text' : 'text-aura-textDim'}`}>{r} RITUAL</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Active Ritual Content */}
                    <View className="bg-white/5 border border-white/10 p-8 rounded-[48px] mb-8">
                        <Text className="text-aura-text font-bold text-sm mb-4 uppercase tracking-[2px]">Step-by-Step</Text>
                        <View className="gap-6">
                            {(recs?.routines?.[activeRoutine] || [1, 2, 3]).map((item: any, index: number) => (
                                <View key={index} className="flex-row items-start">
                                    <Text className="text-aura-accent font-bold mr-4">{index + 1}.</Text>
                                    <View className="flex-1">
                                        <Text className="text-aura-text font-bold text-sm mb-1">{item.title || (activeRoutine === 'AM' ? ['Purify', 'Activate', 'Protect'][index] : ['Unveil', 'Nourish', 'Seal'][index])}</Text>
                                        <Text className="text-aura-textDim text-xs leading-5">{item.desc || 'Apply using an upward massage motion.'}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Naturals & Botanicals */}
                    <View className="p-8 mb-8 bg-aura-primary/10 border border-aura-primary/20 rounded-[48px]">
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="leaf-outline" size={20} color="#CB7896" className="mr-3" />
                            <Text className="text-aura-accent font-bold uppercase text-[10px] tracking-[4px]">Botanical Remedies</Text>
                        </View>
                        <Text className="text-aura-text leading-7 text-sm font-medium">
                            {recs?.botanicals || `Weekly facial infusions will accelerate the ${concern.toLowerCase()} correction. Avoid direct sun exposure peaks.`}
                        </Text>
                    </View>

                    {/* Recommended Products */}
                    <View className="mb-10">
                        <Text className="text-aura-text font-bold text-sm mb-6 uppercase tracking-[4px]">Recommended Selection</Text>
                        <View className="flex-row gap-4">
                            {products.map((p: any, i: number) => (
                                <View key={i} className="flex-1">
                                    <View className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden mb-3">
                                        <Image source={{ uri: p.img }} className="w-full h-40" />
                                    </View>
                                    <Text className="text-aura-text font-bold text-sm mb-1">{p.name}</Text>
                                    <Text className="text-aura-textDim text-[10px] uppercase font-bold tracking-widest">{p.brand}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <NeoButton
                        title="Draft New Analysis"
                        onPress={() => {
                            setStep(1);
                            setUploadedImage(null);
                            setSkinType('');
                            setConcern('');
                            setSensitivity('');
                        }}
                        variant="outline"
                        style={{ marginBottom: 40 }}
                    />
                </ScrollView>
            </Animated.View>
        );
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1 px-5 pt-4">
                <View className="flex-row justify-between items-center mb-10">
                    <View>
                        <Text className="text-aura-text text-4xl font-bold tracking-tight">Skin Analysis</Text>
                    </View>
                </View>

                {step === 1 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View entering={luxurySpring(100)} className="mb-10">
                            <GlassPane style={{ padding: 24, borderRadius: 48 }}>
                                <View className="flex-row gap-4 w-full h-[400px]">
                                    <TouchableOpacity
                                        onPress={handleUpload}
                                        activeOpacity={0.9}
                                        className={`flex-1 items-center justify-center border-2 border-dashed border-white/10 rounded-[40px] bg-white/5 ${uploadedImage ? 'p-0' : 'p-6'}`}
                                    >
                                        {uploadedImage ? (
                                            <Image source={{ uri: uploadedImage }} className="w-full h-full rounded-[30px]" />
                                        ) : (
                                            <>
                                                <View className="bg-aura-accent/10 p-6 rounded-full mb-4">
                                                    <Ionicons name="images-outline" size={40} color="#CB7896" />
                                                </View>
                                                <Text className="text-aura-text font-bold text-lg mb-2 tracking-tight">Gallery</Text>
                                                <Text className="text-aura-textDim text-center text-[10px] leading-4 font-medium uppercase tracking-widest">
                                                    Pick photo
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>

                                    {!uploadedImage && (
                                        <TouchableOpacity
                                            onPress={handleCamera}
                                            activeOpacity={0.9}
                                            className="flex-1 items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-[40px] bg-white/5"
                                        >
                                            <View className="bg-aura-accent/10 p-6 rounded-full mb-4">
                                                <Ionicons name="camera-outline" size={40} color="#CB7896" />
                                            </View>
                                            <Text className="text-aura-text font-bold text-lg mb-2 tracking-tight">Camera</Text>
                                            <Text className="text-aura-textDim text-center text-[10px] leading-4 font-medium uppercase tracking-widest">
                                                Take photo
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </GlassPane>
                        </Animated.View>

                        <NeoButton
                            title="Begin Assessment"
                            onPress={() => setStep(2)}
                            icon={<Ionicons name="arrow-forward" size={20} color="#EFF5F3" />}
                            disabled={!uploadedImage}
                        />
                        <View className="h-24" />
                    </ScrollView>
                )}

                {step === 2 && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Animated.View entering={luxurySpring(100)} className="mb-10">
                            <View className="bg-white/5 border border-white/10 p-8 rounded-[48px] gap-8">
                                <View>
                                    <Text className="text-aura-text font-bold text-xs mb-4 uppercase tracking-[2px]">Skin Architecture</Text>
                                    <View className="flex-row flex-wrap gap-3">
                                        {['Oily', 'Dry', 'Combo', 'Sensitive'].map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                onPress={() => setSkinType(opt)}
                                                className={`px-6 py-3 rounded-full border ${skinType === opt ? 'bg-aura-primary/20 border-aura-accent' : 'bg-white/5 border-white/10'}`}
                                            >
                                                <Text className={`font-bold text-[10px] uppercase ${skinType === opt ? 'text-aura-text' : 'text-aura-textDim'}`}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-aura-text font-bold text-xs mb-4 uppercase tracking-[2px]">Primary Concern</Text>
                                    <View className="flex-row flex-wrap gap-3">
                                        {['Hydration', 'Aging', 'Texture', 'Clarity'].map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                onPress={() => setConcern(opt)}
                                                className={`px-6 py-3 rounded-full border ${concern === opt ? 'bg-aura-primary/20 border-aura-accent' : 'bg-white/5 border-white/10'}`}
                                            >
                                                <Text className={`font-bold text-[10px] uppercase ${concern === opt ? 'text-aura-text' : 'text-aura-textDim'}`}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View>
                                    <Text className="text-aura-text font-bold text-xs mb-4 uppercase tracking-[2px]">Skin Sensitivity</Text>
                                    <View className="flex-row flex-wrap gap-3">
                                        {['Low', 'Medium', 'High'].map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                onPress={() => setSensitivity(opt)}
                                                className={`px-6 py-3 rounded-full border ${sensitivity === opt ? 'bg-aura-primary/20 border-aura-accent' : 'bg-white/5 border-white/10'}`}
                                            >
                                                <Text className={`font-bold text-[10px] uppercase ${sensitivity === opt ? 'text-aura-text' : 'text-aura-textDim'}`}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Animated.View>

                        <View className="mt-4">
                            <NeoButton
                                title={analyzing ? "Synthesizing Dermal Data..." : "Run AI Diagnostics"}
                                onPress={handleAnalyze}
                                icon={!analyzing && <Ionicons name="sparkles" size={20} color="#EFF5F3" />}
                                disabled={analyzing || !skinType || !concern || !sensitivity}
                            />
                        </View>

                        {analyzing && (
                            <View className="mt-12 items-center">
                                <ActivityIndicator size="large" color="#CB7896" />
                                <Text className="text-aura-textDim mt-6 font-bold tracking-[3px] uppercase text-[10px]">Mapping skin topography...</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => setStep(1)}
                            className="mt-8 items-center"
                        >
                            <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-widest">Back to Capture</Text>
                        </TouchableOpacity>

                        <View className="h-24" />
                    </ScrollView>
                )}

                {step === 3 && <ResultView />}
            </SafeAreaView>
        </CosmicBackground>
    );
}
