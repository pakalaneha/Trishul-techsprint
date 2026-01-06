from flask import Blueprint, request, jsonify
from backend.models import db, User
from backend.skin_analysis import analyze_skin_tone
from backend.gemini_service import GeminiService

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "AURA Backend API is running."

# --------------------------
# Auth Endpoints (Dummy + DB)
# --------------------------

@main.route('/login', methods=['POST'])
def login():
    print(f"DEBUG: Login request received. Form: {request.form}")
    identifier = request.form.get('username') # This could be username or email
    password = request.form.get('password')
    
    if not identifier or not password:
        return "Missing username/email or password", 400

    # Check both username and email
    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    
    if user:
         # In a real app, verify password hash
         # if check_password_hash(user.password_hash, password)
         user_data = user.to_dict()
         user_data['displayName'] = user.name or user.username
         return jsonify({"message": "Login successful", "user": user_data}), 200
    
    return "Invalid username or password", 401

@main.app_errorhandler(Exception)
def handle_exception(e):
    from flask import jsonify
    print(f"CRITICAL ERROR: {e}")
    return jsonify({"error": str(e)}), 500

@main.route('/signup', methods=['POST'])
def signup():
    print(f"DEBUG: Signup request received. Form: {request.form}")
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    name = request.form.get('name')
    phone = request.form.get('phone')
    
    if not username or not email or not password:
        print(f"DEBUG: Missing fields. U:{username} E:{email} P:{'set' if password else 'none'}")
        return jsonify({"error": "Missing required fields (username, email, password)"}), 400
    
    if User.query.filter_by(username=username).first():
        return "Username already exists", 400
    
    if User.query.filter_by(email=email).first():
        print(f"DEBUG: Email {email} already exists")
        return "Email already exists", 400
        
    try:
        new_user = User(username=username, email=email, password_hash=password, name=name, phone=phone)
        db.session.add(new_user)
        db.session.commit()
        print(f"DEBUG: User {username} created successfully")
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: Error during user creation: {e}")
        return str(e), 500
    
    return jsonify({"success": True}), 200

@main.route('/logout', methods=['GET'])
def logout():
    return "Logged out", 200

@main.route('/profile', methods=['GET'])
def profile():
    username = request.args.get('username')
    if not username:
        # Fallback to last user for demo, but prefer specific user
        user = User.query.order_by(User.id.desc()).first()
    else:
        user = User.query.filter_by(username=username).first()
        
    if user:
        user_data = user.to_dict()
        user_data['displayName'] = user.name or user.username
        return jsonify(user_data), 200
    return "No user found", 404

@main.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    username = request.form.get('username')
    styles = request.form.get('styles') # Comma-separated
    goals = request.form.get('goals')
    fav_colors = request.form.get('fav_colors')
    avoid_colors = request.form.get('avoid_colors')
    
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if not user:
        return "User not found", 404
        
    # We can store these in User model or a new Quiz model. 
    # For now, let's repurpose style_vibe or add fields.
    # To keep it simple, let's just save style_vibe as the first style for now.
    if styles:
        user.style_vibe = styles.split(',')[0]
    
    # In a real app, we'd have a StyleDNA table. 
    # For this demo, let's just confirm success.
    db.session.commit()
    return jsonify({"success": True}), 200

# --------------------------
# Feature Endpoints
# --------------------------

@main.route('/api/skin-tone-detection', methods=['POST'])
def skin_tone_detection():
    # Use provided username or last registered for demo
    username = request.form.get('username')
    if 'profile_pic' not in request.files:
        return jsonify({"error": "No image provided"}), 400
        
    file = request.files['profile_pic']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Read file into memory
    file_bytes = file.read()
    
    # Use Gemini for better analysis
    try:
        result = GeminiService.analyze_skin_tone(file_bytes)
    except Exception as e:
        print(f"DEBUG: Gemini skin analysis error, using dummy: {e}")
        result = None
    
    if not result:
        # Final fallback to dummy
        print("DEBUG: Using dummy skin analysis")
        result = GeminiService.get_dummy_skin_tone()
    
    # Persistence
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if user:
        user.skin_tone = result.get('skin_tone')
        palette = result.get('recommended_colors', [])
        if isinstance(palette, list):
            user.color_palette = ",".join(palette)
        else:
            user.color_palette = str(palette)
            
        user.style_vibe = result.get('season')
        db.session.commit()
        print(f"DEBUG: Saved skin analysis for {user.username}")
        
    return jsonify(result), 200

@main.route('/api/body-shape-analysis', methods=['POST'])
def body_shape_analysis():
    username = request.form.get('username')
    
    if 'image' not in request.files and 'profile_pic' not in request.files:
         return jsonify({"error": "No image provided"}), 400
         
    file = request.files.get('image') or request.files.get('profile_pic')
    file_bytes = file.read()
    
    # Mock Full Body Check
    # In a real app, this would use a model to check for persons presence and posture.
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(file_bytes))
    width, height = img.size
    
    # Simple heuristic: Full body images are usually taller than they are wide (portrait)
    # If the image is not significantly taller than wide, we assume it's NOT full body.
    is_full_body = height > (width * 1.1) 
    
    if not is_full_body:
        return jsonify({"error": "Invalid image. Please upload a full-body image for accurate analysis"}), 400

    try:
        result = GeminiService.analyze_body_shape(file_bytes)
    except Exception as e:
        print(f"DEBUG: Gemini body analysis error, using dummy: {e}")
        result = None
    
    if not result:
        print("DEBUG: Using dummy body shape analysis")
        result = GeminiService.get_dummy_body_shape()
    
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if user:
        user.body_shape = result.get('body_shape')
        db.session.commit()
    return jsonify(result), 200

# Dummies
@main.route('/api/skin-analysis', methods=['POST'])
def skin_analysis():
    username = request.form.get('username')
    
    if 'image' not in request.files:
         return jsonify({"error": "No image provided"}), 400
         
    file = request.files['image']
    file_bytes = file.read()
    
    try:
        result = GeminiService.analyze_skin_health(file_bytes)
    except Exception as e:
        print(f"DEBUG: Gemini skin health analysis error, using dummy: {e}")
        result = None
    
    if not result:
        print("DEBUG: Using dummy skin health analysis")
        result = GeminiService.get_dummy_skin_health()
    
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if user:
        user.skin_type = result.get('skin_type')
        db.session.commit()
    return jsonify(result), 200

@main.route('/api/outfit-recommendation', methods=['POST'])
def outfit_rec_dummy():
    return jsonify({
        "items": {
            "top": "Blue Silk Blouse",
            "bottom": "White Trousers",
            "shoes": "Beige Heels",
            "accessory": "Gold Necklace"
        },
        "reasoning": "Perfect for the occasion (Mock)",
        "tips": "Add a scarf for flair."
    }), 200

@main.route('/api/weather-outfit', methods=['POST'])
def weather_outfit_dummy():
    return jsonify({"recommendations": ["Coat", "Scarf"]}), 200

@main.route('/run_virtual_try_on', methods=['POST'])
def vton_dummy():
    return jsonify({"status": "processing", "task_id": "123"}), 200

@main.route('/check_status/<username>/<vton>/<garm>', methods=['GET'])
def check_status_dummy(username, vton, garm):
    return jsonify({
        "status": "completed",
        "img_one": "static/dummy_result_1.jpg",
        "img_two": "static/dummy_result_2.jpg"
    }), 200

@main.route('/api/save-analysis', methods=['POST'])
def save_analysis():
    # Generic save endpoint for different analysis types
    username = request.form.get('username')
    analysis_type = request.form.get('type') # 'skin', 'body', 'color'
    value = request.form.get('value')
    
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if not user:
        return "User not found", 404
        
    if analysis_type == 'skin':
        user.skin_tone = value
    elif analysis_type == 'skin_type':
        user.skin_type = value
    elif analysis_type == 'body':
        user.body_shape = value
    elif analysis_type == 'color':
        user.color_palette = value
    elif analysis_type == 'vibe':
        user.style_vibe = value
        
    db.session.commit()
    return jsonify({"success": True}), 200

@main.route('/api/update-settings', methods=['POST'])
def update_settings():
    username = request.form.get('username')
    dark_mode = request.form.get('dark_mode')
    notifications = request.form.get('notifications')
    
    user = User.query.filter_by(username=username).first() if username else User.query.order_by(User.id.desc()).first()
    if not user:
        return "User not found", 404
        
    if dark_mode is not None:
        user.dark_mode = dark_mode.lower() == 'true'
    if notifications is not None:
        user.notifications_enabled = notifications.lower() == 'true'
        
    db.session.commit()
    return jsonify({"success": True}), 200
