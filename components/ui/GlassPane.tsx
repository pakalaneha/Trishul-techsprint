import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GlassPaneProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    showBorder?: boolean;
}

export const GlassPane: React.FC<GlassPaneProps> = ({ children, style, intensity = 40, showBorder = true }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Inner Glow */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.05)', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Shimmering Luxury Border */}
            {showBorder && (
                <View style={StyleSheet.absoluteFill}>
                    <View style={[styles.border, { borderColor: 'rgba(226, 209, 187, 0.1)' }]} />
                    <LinearGradient
                        colors={['transparent', 'rgba(203, 120, 150, 0.2)', 'transparent']} // Pink/Rose highlight
                        style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </View>
            )}

            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 14, 23, 0.85)', // Aura BG with higher opacity for text stability
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1.2,
        borderRadius: 32,
    },
    content: {
        padding: 24,
    },
});
