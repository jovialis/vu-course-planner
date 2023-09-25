import os
import firebase_admin
from firebase_admin import auth, credentials
from flask import jsonify, request

# Initialize Firebase Admin SDK
cred_path = os.environ.get('FIREBASE_ADMIN_SDK_PATH')
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

def authenticate_with_gmail(request):
    """
    Authenticates user with a Gmail account using Firebase.
    Expects an ID token from a client-side Firebase project.
    """
    if request.method != 'POST':
        return 'Only POST requests are accepted', 405
    
    id_token = request.json.get('idToken')
    if not id_token:
        return 'Missing ID token', 400
    
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token.get('uid')
        
        # Check if the email provider is Gmail
        user = auth.get_user(uid)
        if user.provider_data[0].provider_id != 'google.com':
            return 'Only Gmail accounts are allowed', 403
        
        return jsonify({"uid": uid, "email": user.email})
    except ValueError as e:
        return f"Token verification failed: {e}", 401
    
    except Exception as e:
        return f"Authentication failed: {e}", 500
    

