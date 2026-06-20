from pathlib import Path
from datetime import timedelta
from decouple import config


BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "refill-doorstop-gab.ngrok-free.dev",
]


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",

    "users",
    "security",
    "subjects",
    "courses",
    "enrollments",
    "access_codes",
    "purchases",
    "lessons",
    "admin_dashboard",
    "teacher_dashboard",
    "student_dashboard",
    "ai_assistant",
    'core',
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "config.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default="5432"),
    }
}


AUTH_USER_MODEL = "users.User"


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "security.authentication.CookieJWTAuthentication",
    ),
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,

    "AUTH_HEADER_TYPES": ("Bearer",),
}


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-device-id",
    "x-device-name",
]


LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Amman"
USE_I18N = True
USE_TZ = True


STATIC_URL = "static/"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


MUX_TOKEN_ID = config("MUX_TOKEN_ID", default="")
MUX_TOKEN_SECRET = config("MUX_TOKEN_SECRET", default="")

MUX_DRM_ENABLED = config(
    "MUX_DRM_ENABLED",
    default=False,
    cast=bool,
)

MUX_DRM_CONFIGURATION_ID = config(
    "MUX_DRM_CONFIGURATION_ID",
    default="",
)

MUX_DRM_SIGNING_KEY = config(
    "MUX_DRM_SIGNING_KEY",
    default="",
)

MUX_DRM_PRIVATE_KEY = config(
    "MUX_DRM_PRIVATE_KEY",
    default="",
)

MUX_WEBHOOK_SECRET = config("MUX_WEBHOOK_SECRET", default="")
OPENAI_API_KEY = config("OPENAI_API_KEY")

OPENAI_MODEL = config(
    "OPENAI_MODEL",
    default="gpt-4o-mini"
)

OPENAI_EMBEDDING_MODEL = config(
    "OPENAI_EMBEDDING_MODEL",
    default="text-embedding-3-small"
)