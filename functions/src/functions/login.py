from firebase_admin import credentials, firestore
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from firebase_functions import identity_fn

# Block account creation with any non-Vanderbilt email address.
@identity_fn.before_user_created()
def validate_new_user(
    event: identity_fn.AuthBlockingEvent,
) -> identity_fn.BeforeCreateResponse | None:
    # User data passed in from the CloudEvent.
    user = event.data

    # Only users of a specific domain can sign up.
    if user.email is None or "@vanderbilt.edu" not in user.email:
        # Return None so that Firebase Auth rejects the account creation.
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="Unauthorized email",
        )

