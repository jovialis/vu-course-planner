from firebase_admin import initialize_app

from src.functions.login import validate_new_user
from src.functions.timelines import get_user_timelines
from src.functions.timelines import get_user_timeline
from src.functions.timelines import rename_user_timeline
from src.functions.timelines import create_user_timeline
from src.functions.timelines import add_course_to_timeline
from src.functions.timelines import del_course_from_timeline
from src.functions.timelines import del_user_timeline
from src.functions.lookups import lookup_course
from src.functions.users import set_user_data
from src.functions.users import get_user_data
from src.functions.rating import get_rating
from src.functions.rating import rating
from src.functions.rating import scoring

initialize_app()
