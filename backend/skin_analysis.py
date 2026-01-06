try:
    import cv2
    import numpy as np
    from sklearn.cluster import KMeans
except ImportError:
    cv2 = None
    np = None
    KMeans = None


# 1. Diverse Fashion Mappings (from User)
PALETTE_MAPPING = {
    "Very Light": ["#E0115F", "#0047AB", "#FFFDD0", "#5D3FD3", "#00A36C"], # Ruby, Cobalt, Cream, Iris, Jade
    "Light": ["#000080", "#FFDAB9", "#800020", "#4B0082", "#F5F5DC"],      # Navy, Peach, Burgundy, Indigo, Beige
    "Intermediate": ["#FF7F50", "#008080", "#FAF9F6", "#DAA520", "#36454F"], # Coral, Teal, Off-White, Goldenrod, Charcoal
    "Tan": ["#FFFFFF", "#FAF0E6", "#2E8B57", "#E6E6FA", "#4682B4"],          # White, Linen, Sea Green, Lavender, Steel Blue
    "Brown": ["#FFD700", "#FAD5A5", "#00CED1", "#BC8F8F", "#FF8C00"],        # Gold, Sunset, Turquoise, Rose, Dark Orange
    "Dark": ["#F5F5DC", "#FF00FF", "#00FF00", "#00FFFF", "#FFFFFF"]          # Ivory, Fuchsia, Lime, Cyan, Pure White
}

def get_ita_category(rgb):
    """Categorizes skin tone using ITA (Individual Typology Angle)"""
    # Normalize RGB to 0-1
    r, g, b = rgb / 255.0
    # Simple conversion to L*a*b* (approximate) for ITA calculation
    # Using the user's logic directly
    val = (0.2126*r + 0.7152*g + 0.0722*b)
    # Avoid log(0)
    if val <= 0.008856:
         L = 903.3 * val
    else:
         L = 116 * (val)**(1/3) - 16
         
    # The user code had a heuristic mapping based on brightness, not full ITA calculation completion
    # Re-using User's heuristic:
    brightness = np.mean(rgb)
    if brightness > 200: return "Very Light"
    if brightness > 150: return "Light"
    if brightness > 120: return "Intermediate"
    if brightness > 100: return "Tan"
    if brightness > 60: return "Brown"
    return "Dark"

def analyze_skin_tone(image_path_or_buffer):
    try:
        if isinstance(image_path_or_buffer, str):
            img = cv2.imread(image_path_or_buffer)
        else:
            # Assume buffer (e.g. from Flask request.files['file'].read())
            nparr = np.frombuffer(image_path_or_buffer, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return None

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        ycbcr = cv2.cvtColor(img, cv2.COLOR_RGB2YCrCb)

        # Robust Multi-Space Masking (HSV + YCbCr)
        mask_hsv = cv2.inRange(hsv, np.array([0, 15, 0]), np.array([25, 255, 255]))
        mask_ycbcr = cv2.inRange(ycbcr, np.array([0, 133, 77]), np.array([255, 173, 127]))
        final_mask = cv2.bitwise_and(mask_hsv, mask_ycbcr)

        skin_pixels = img[final_mask > 0].reshape(-1, 3)

        if len(skin_pixels) > 50:
            # 3. Use 3 clusters to find the actual skin
            kmeans = KMeans(n_clusters=3, n_init='auto').fit(skin_pixels)
            centers = kmeans.cluster_centers_
            main_skin_rgb = centers[np.argmax(np.mean(centers, axis=1))].astype(int)
            
            hex_code = '#{:02x}{:02x}{:02x}'.format(*main_skin_rgb)
            category = get_ita_category(main_skin_rgb)
            fashion_palette = PALETTE_MAPPING.get(category, [])
            
            return {
                "skin_tone": hex_code,
                "season": category,
                "recommended_colors": fashion_palette,
                "avoid_colors": [], # No logic provided for avoid yet
                "description": f"Detected skin tone: {category}"
            }
        else:
            return None
    except Exception as e:
        print(f"Error in analysis: {e}")
        return None
