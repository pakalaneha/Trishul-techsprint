import { FlaskApiService } from './flaskApiService';

/**
 * AI Service
 * Handles all AI-powered features using Flask backend
 */
export const AIService = {
    /**
     * Analyze skin tone using DeepFace
     */
    analyzeSkinTone: async (imageUri: string) => {
        try {
            const result = await FlaskApiService.analyzeSkinTone(imageUri);
            return result;
        } catch (error: any) {
            console.error('Skin tone analysis error:', error);

            // Fallback to simulation if backend fails
            await new Promise(resolve => setTimeout(resolve, 2000));
            const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
            const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];

            let palette: string[];
            let avoid: string[];

            switch (randomSeason) {
                case 'Spring':
                    palette = ['#FFD700', '#FF6347', '#98FB98', '#40E0D0', '#FFA07A'];
                    avoid = ['#000000', '#FFFFFF', '#696969'];
                    break;
                case 'Summer':
                    palette = ['#B0E0E6', '#E6E6FA', '#FFB6C1', '#708090', '#F08080'];
                    avoid = ['#FFA500', '#FFD700', '#000000'];
                    break;
                case 'Autumn':
                    palette = ['#8B4513', '#DAA520', '#556B2F', '#A0522D', '#CD853F'];
                    avoid = ['#FF69B4', '#00FFFF', '#E6E6FA'];
                    break;
                case 'Winter':
                    palette = ['#000000', '#FFFFFF', '#FF0000', '#000080', '#00FF00'];
                    avoid = ['#DAA520', '#A0522D', '#F5F5DC'];
                    break;
                default:
                    palette = [];
                    avoid = [];
            }

            return {
                season: randomSeason,
                palette: palette,
                avoid: avoid,
                description: `Simulated: You have a ${randomSeason} complexion.`,
                skinTone: 'Medium', // Satisfy TypeScript
            };
        }
    },

    /**
     * Analyze skin type/condition
     */
    analyzeSkin: async (imageUri: string) => {
        try {
            const result: any = await FlaskApiService.analyzeSkin(imageUri);
            return {
                label: result.skin_type || 'Normal',
                confidence: result.confidence || 90,
                isClear: true,
                description: result.description || `Detected ${result.skin_type} skin condition.`,
                concerns: result.concerns || []
            };
        } catch (error: any) {
            console.error('Skin analysis error:', error);
            // Fallback
            return {
                label: 'Normal',
                confidence: 70,
                isClear: true,
                description: 'Analysis completed with fallback logic.',
                concerns: []
            };
        }
    },

    /**
     * Get skin care recommendations
     */
    getSkinRecommendations: (skinType: string) => {
        const recommendations: Record<string, any> = {
            'Normal': {
                botanicals: "Weekly Matcha face masks or Rosehip oil infusions will maintain your natural radiance.",
                routines: {
                    AM: [
                        { step: 'Purify', title: 'Gentle Cleanser', desc: 'Maintain moisture balance.' },
                        { step: 'Activate', title: 'Vitamin C Serum', desc: 'Boost collagen and protect.' },
                        { step: 'Protect', title: 'Mineral SPF 30', desc: 'Shield from UV damage.' }
                    ],
                    PM: [
                        { step: 'Unveil', title: 'Oil-Based Cleanser', desc: 'Remove environmental pollutants.' },
                        { step: 'Nourish', title: 'Hyaluronic Acid', desc: 'Dewy hydration overnight.' },
                        { step: 'Seal', title: 'Light Moisturizer', desc: 'Lock in active nutrients.' }
                    ]
                },
                products: [
                    { name: 'Velvet Cloud Cleanser', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1556223213-920407632941?auto=format&fit=crop&q=80' },
                    { name: 'Rose Quartz Serum', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80' },
                ]
            },
            'Dry': {
                botanicals: "Incorporate Avocado oil or Oat-based masks to restore the lipid barrier.",
                routines: {
                    AM: [
                        { step: 'Purify', title: 'Cream Cleanser', desc: 'Wash without stripping oils.' },
                        { step: 'Activate', title: 'Hydrating Essence', desc: 'Deep cellular saturation.' },
                        { step: 'Protect', title: 'Barrier Cream', desc: 'Rich moisture lock.' }
                    ],
                    PM: [
                        { step: 'Unveil', title: 'Balm Cleanser', desc: 'Deep melt of makeup and impurities.' },
                        { step: 'Nourish', title: 'Squalane Oil', desc: 'Intensive skin repair and glow.' },
                        { step: 'Seal', title: 'Ceramide Balm', desc: 'Ultimate overnight restoration.' }
                    ]
                },
                products: [
                    { name: 'Dewy Nectar Oil', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80' },
                    { name: 'Silk Barrier Balm', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80' },
                ]
            },
            'Oily': {
                botanicals: "Tea Tree leaf steam sessions and Clay-based toners will balance sebum production.",
                routines: {
                    AM: [
                        { step: 'Purify', title: 'Gel Purifier', desc: 'Clear excess oil and debris.' },
                        { step: 'Activate', title: 'Niacinamide', desc: 'Minimize pores and stabilize sebum.' },
                        { step: 'Protect', title: 'Matte SPF', desc: 'Weightless protection.' }
                    ],
                    PM: [
                        { step: 'Unveil', title: 'Double Wash', desc: 'Deep pore purification.' },
                        { step: 'Nourish', title: 'Salicylic Liquid', desc: 'Clear cellular congestion.' },
                        { step: 'Seal', title: 'Oil-Free Water Gel', desc: 'Hydrate without heaviness.' }
                    ]
                },
                products: [
                    { name: 'Arctic Clarity Gel', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1556227702-d1e4e7ca5c23?auto=format&fit=crop&q=80' },
                    { name: 'Obsidian Pore Mist', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&q=80' },
                ]
            },
            'Acne': {
                botanicals: "Weekly Turmeric & Honey infusions will soothe inflammation and clear texture.",
                routines: {
                    AM: [
                        { step: 'Purify', title: 'Sulfur Wash', desc: 'Anti-microbial surface cleaning.' },
                        { step: 'Activate', title: 'Zinc Serum', desc: 'Reduce redness and swelling.' },
                        { step: 'Protect', title: 'Non-Comedogenic SPF', desc: 'Blemish-safe protection.' }
                    ],
                    PM: [
                        { step: 'Unveil', title: 'Micellar Water', desc: 'Gentle, friction-free clearing.' },
                        { step: 'Nourish', title: 'Azelaic Acid', desc: 'Repair post-acne marks.' },
                        { step: 'Seal', title: 'Lightweight Repair', desc: 'Soothe without clogging.' }
                    ]
                },
                products: [
                    { name: 'Zen Clarity Drops', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1617897903246-7392ce7ec77a?auto=format&fit=crop&q=80' },
                    { name: 'Lunar Blemish Relief', brand: 'Aura Atelier', img: 'https://images.unsplash.com/photo-1620917670397-dc71bce6d21d?auto=format&fit=crop&q=80' },
                ]
            },
        };

        return recommendations[skinType] || recommendations['Normal'];
    },

    /**
     * Generate outfit recommendations
     */
    generateOutfit: async (userProfile: any, context: { occasion: string, weather: string, mood: string }) => {
        try {
            const result = await FlaskApiService.generateOutfit({
                occasion: context.occasion,
                weather: context.weather,
                mood: context.mood,
                userProfile,
            });
            return result;
        } catch (error: any) {
            console.error('Outfit generation error:', error);

            // Fallback to simulation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { occasion, weather, mood } = context;
            let top = "Classic White Tee";
            let bottom = "Blue Denim Jeans";
            let shoes = "White Sneakers";
            let accessory = "Minimalist Watch";
            let tips = `A timeless look that works for everything.`;

            if (occasion === 'Date Night') {
                top = "Silk Button-Down";
                bottom = "Tailored Chinos";
                shoes = "Leather Loafers";
                accessory = "Gold Chain";
                tips = "Sleek and sophisticated. The silk fabric adds a touch of romance.";
            } else if (occasion === 'Work') {
                top = "Structured Blazer";
                bottom = "Pleated Trousers";
                shoes = "Oxford Shoes";
                tips = "Professional yet stylish. Commands respect while keeping you comfortable.";
            } else if (occasion === 'Party') {
                top = "Sequin Top";
                bottom = "Leather Skirt/Pants";
                shoes = "Statement Heels/Boots";
                tips = "Bold and high-energy. Shows off your confidence!";
            }

            if (weather === 'Cold') {
                top = "Chunky Knit Sweater over " + top;
                tips += " The layering keeps you warm without losing style points.";
            }

            return {
                items: { top, bottom, shoes, accessory },
                reasoning: `Simulated: Based on your ${mood} mood for ${occasion}.`,
                tips: tips
            };
        }
    },

    /**
     * Calculate body shape
     */
    calculateBodyShape: (bust: number, waist: number, hips: number) => {
        let shape = "Rectangle";
        let description = "Your bust, waist, and hips are fairly uniform. You have an athletic silhouette.";
        let tips = "Define your waist with belts and cinch-waist dresses. Layers work great for you!";

        if (hips > bust * 1.05 && hips > waist * 1.05) {
            shape = "Pear";
            description = "Your hips are wider than your bust and waist.";
            tips = "Highlight your upper body with patterns and keep bottoms simple/dark.";
        } else if (bust > hips * 1.05 && bust > waist * 1.05) {
            shape = "Inverted Triangle";
            description = "Your shoulders/bust are broader than your hips.";
            tips = "Add volume to your lower body with A-line skirts or wide-leg pants.";
        } else if (waist < bust * 0.75 && waist < hips * 0.75) {
            shape = "Hourglass";
            description = "Your waist is significantly smaller than your bust and hips.";
            tips = "Embrace your curves! Fitted clothes are your best friend.";
        } else if (waist > bust * 1.05 || waist > hips * 1.05) {
            shape = "Apple";
            description = "You carry weight around your midsection.";
            tips = "Empire waistlines and structured jackets are perfect for elongation.";
        }

        return { shape, description, tips };
    },

    /**
     * Virtual try-on
     */
    virtualTryOn: async (userImageUri: string, clothingImageUri: string) => {
        try {
            const result = await FlaskApiService.virtualTryOn(userImageUri, clothingImageUri);
            return result;
        } catch (error: any) {
            console.error('Virtual try-on error:', error);
            throw new Error(error.message || 'Virtual try-on failed');
        }
    },

    /**
     * Get weather-based outfit
     */
    getWeatherOutfit: async (season: string, gender: string) => {
        try {
            const recommendations = await FlaskApiService.getWeatherOutfit(season, gender);
            return recommendations;
        } catch (error: any) {
            console.error('Weather outfit error:', error);
            return [];
        }
    },
};
