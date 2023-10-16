from firebase_admin import initialize_app

from src.functions.login import validate_new_user
from src.functions.lookups import lookup_course
from src.functions.users import set_user_data
from src.functions.users import get_user_data
from src.functions.testing import test_warehouse_all_courses

initialize_app()
