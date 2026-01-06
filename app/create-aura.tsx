import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/ui/CosmicBackground';
import { NeoButton } from '../components/ui/NeoButton';
import { useAuth } from '../services/authStore';
import { db } from '../services/firebaseConfig';

const STEPS = [
    { id: 'vibe', title: 'The Presence', subtitle: 'Select the silhouettes that define your essence.' },
    { id: 'colors_love', title: 'Signature Tones', subtitle: 'Which shades amplify your inner aura?' },
    { id: 'colors_avoid', title: 'Dissonant Tones', subtitle: 'Colors that fail to resonate with your vision.' },
    { id: 'goals', title: 'The Objective', subtitle: 'What is the ultimate goal of your style evolution?' },
];

const STYLE_OPTIONS = ['Architectural', 'Neo-Classic', 'Street-Couture', 'Minimalist', 'Avant-Garde', 'Dark-Academia', 'Athleisure-Elite', 'Vintage-Noir'];
const GOAL_OPTIONS = ['Command Presence', 'Ethereal Expression', 'Absolute Utility', 'Trend Orchestration', 'Capsule Perfection'];

const COLOR_OPTIONS = [
    { name: 'Obsidian', hex: '#140E17' },
    { name: 'Pink', hex: '#CB7896' },
    { name: 'Purple', hex: '#705367' },
    { name: 'Rose', hex: '#CB7896' },
    { name: 'Deep Purple', hex: '#452B40' },
    { name: 'Soft Green', hex: '#EFF5F3' },
    { name: 'Muted Pink', hex: '#CB7896' },
    { name: 'Dark Violet', hex: '#251A2A' },
];

export default function CreateAuraScreen() {
    const router = useRouter();
    const user = useAuth((state) => state.user);
    const setOnboardingCompleted = useAuth((state) => state.setOnboardingCompleted);

    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({
        styles: [] as string[],
        colors_love: [] as string[],
        colors_avoid: [] as string[],
        goals: [] as string[],
    });

    const handleSelect = (category: 'styles' | 'colors_love' | 'colors_avoid' | 'goals', item: string) => {
        setSelections(prev => {
            const list = prev[category];
            if (list.includes(item)) {
                return { ...prev, [category]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [category]: [...list, item] };
            }
        });
    };

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            await finishSetup();
        }
    };

    const finishSetup = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "users", user.uid), {
                styleDNA: {
                    styles: selections.styles,
                    colors: {
                        favorite: selections.colors_love,
                        disliked: selections.colors_avoid
                    },
                    goals: selections.goals,
                    budget: 'Exclusive',
                },
                onboardingCompleted: true,
            });
            setOnboardingCompleted(true);
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error(error);
            setOnboardingCompleted(true);
            router.replace('/(tabs)/home');
        }
    };

    const renderStepContent = () => {
        const stepId = STEPS[currentStep].id;

        if (stepId === 'vibe' || stepId === 'goals') {
            const list = stepId === 'vibe' ? selections.styles : selections.goals;
            const options = stepId === 'vibe' ? STYLE_OPTIONS : GOAL_OPTIONS;
            const category = stepId === 'vibe' ? 'styles' : 'goals';

            return (
                <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="flex-col gap-4">
                    {options.map(option => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => handleSelect(category, option)}
                            className={`p-6 rounded-[32px] border-2 flex-row justify-between items-center ${list.includes(option)
                                ? 'bg-aura-primary/20 border-aura-accent'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <Text className={`text-base font-medium tracking-tight ${list.includes(option) ? 'text-aura-text' : 'text-aura-textDim'}`}>
                                {option}
                            </Text>
                            {list.includes(option) && <Ionicons name="checkmark-circle-sharp" size={24} color="#CB7896" />}
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            );
        }

        if (stepId === 'colors_love' || stepId === 'colors_avoid') {
            const isAvoid = stepId === 'colors_avoid';
            const list = isAvoid ? selections.colors_avoid : selections.colors_love;
            const category = isAvoid ? 'colors_avoid' : 'colors_love';

            return (
                <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="flex-row flex-wrap gap-4 justify-between">
                    {COLOR_OPTIONS.map(color => (
                        <TouchableOpacity
                            key={color.name}
                            onPress={() => handleSelect(category, color.name)}
                            className={`w-[47%] h-32 rounded-[36px] p-1 border-2 ${list.includes(color.name) ? (isAvoid ? 'border-aura-secondary' : 'border-aura-accent') : 'border-white/10'}`}
                        >
                            <View style={{ backgroundColor: color.hex }} className="flex-1 rounded-[34px] overflow-hidden justify-end p-4">
                                <View className="bg-black/40 backdrop-blur-sm self-start px-3 py-1 rounded-full">
                                    <Text className="text-[10px] font-bold text-white uppercase tracking-widest">{color.name}</Text>
                                </View>
                                {list.includes(color.name) && (
                                    <View className="absolute top-4 right-4">
                                        <Ionicons name={isAvoid ? 'close-circle' : 'checkmark-circle'} size={24} color={isAvoid ? '#CB7896' : '#CB7896'} />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            );
        }
    };

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1 px-6 pt-4">
                <View className="flex-row justify-between items-center mb-10">
                    <View>
                        <Text className="text-aura-accent text-[10px] font-bold uppercase tracking-[4px] mb-2">
                            Maison d'Aura • Initialization {currentStep + 1}/{STEPS.length}
                        </Text>
                        <Text className="text-aura-text text-4xl font-bold tracking-tight">{STEPS[currentStep].title}</Text>
                        <Text className="text-aura-textDim text-sm mt-2 tracking-wide font-medium italic">"{STEPS[currentStep].subtitle}"</Text>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {renderStepContent()}
                    <View className="h-20" />
                </ScrollView>

                <View className="pb-8 pt-4">
                    <NeoButton
                        title={currentStep === STEPS.length - 1 ? 'Archetype Complete' : 'Proceed to Next'}
                        onPress={handleNext}
                        icon={<Ionicons name="chevron-forward" size={20} color="#EFF5F3" />}
                    />

                    {currentStep > 0 && (
                        <TouchableOpacity
                            onPress={() => setCurrentStep(prev => prev - 1)}
                            className="mt-4 py-2 items-center"
                        >
                            <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-[2px]">Revision Required</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </CosmicBackground>
    );
}
