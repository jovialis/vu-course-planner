# This is a Python-like representation; Firebase authentication typically uses JavaScript.
from firebase.auth import get_auth, sign_in_with_popup, GoogleAuthProvider

auth = get_auth()
provider = GoogleAuthProvider()
provider.set_custom_parameters({
    'access_type': 'offline',
    'prompt': 'consent'
})
sign_in_with_popup(auth, provider)

