from pathlib import Path
from datetime import timedelta
import environ
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


env = environ.Env(
    DEBUG=(bool, False),
)

environ.Env.read_env(BASE_DIR/ '.env')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY', default='django-insecure-b)ai68p7bb_^@8j%uvsmkmf^fg(-4td-!2hw)#gx6debam3-(@')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['localhost', '127.0.0.1'])

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_PERMISSION_CLASSES':[
        "rest_framework.permissions.IsAuthenticated",
    ],

    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}


REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'nexus-access-token',
    'JWT_AUTH_REFRESH_COOKIE': 'nexus-refresh-token',
    'JWT_AUTH_HTTPONLY': True,
    'JWT_AUTH_SECURE': not DEBUG,
    'JWT_AUTH_SAMESITE': 'None' if not DEBUG else 'Lax',
    'JWT_AUTH_COOKIE_USE_CSRF': True,
    'SESSION_LOGIN': False,
    'TOKEN_MODEL': None,  # Disable default token model
    'JWT_TOKEN_CLAIMS_SERIALIZER': 'authentication.serializers.CustomTokenClaimsSerializer',
    'USER_DETAILS_SERIALIZER': 'authentication.serializers.UserSerializer', # Use your app name
    "REGISTER_SERIALIZER": "authentication.serializers.RegisterUserSerializer",
    "PASSWORD_RESET_SERIALIZER": "authentication.serializers.CustomPasswordResetSerializer",
    "PASSWORD_RESET_CONFIRM_SERIALIZER": "authentication.serializers.CustomPasswordResetConfirmSerializer",
    # 'LOGIN_SERIALIZER': "authentication.serializers.UserLoginSerializer",
}


SPECTACULAR_SETTINGS = {
    'TITLE': 'EduNexus API',
    'DESCRIPTION': 'API with detailed documentation',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False, # set to True if you want to include schema in Swagger UI/Redoc

    'SECURITY': [{'BearerAuth': []}],
    'APPEND_COMPONENTS': {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }
    },

    'SWAGGER_UI_DIST': 'SIDECAR', # Use sidecar to bundle static files
    'REDOC_UI_DIST': 'SIDECAR', # Use sidecar to bundle static files
    'COMPONENT_SPLIT_REQUEST': True,
}



# Application definition

INSTALLED_APPS = [
    'daphne',  # Must be first — patches runserver to use ASGI
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django.contrib.sites",

    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    'corsheaders',

    # social authentication
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.apple',
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # Documentation
    'drf_spectacular',
    'drf_spectacular_sidecar',

    "phonenumber_field",

    'channels',

    "authentication",
    "courses",
    "user",
    "payments",
    "chat",

    # for site telemetry
    'django_user_agents',

    'storages',

    # for file removal after changes
    "django_cleanup.apps.CleanupConfig",
]

SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
    'django_user_agents.middleware.UserAgentMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

# Channel Layers — use InMemoryChannelLayer for development
# For production, switch to Redis:
#   pip install channels_redis
#   CHANNEL_LAYERS = { 'default': { 'BACKEND': 'channels_redis.core.RedisChannelLayer', 'CONFIG': { 'hosts': [('127.0.0.1', 6379)] } } }
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

if DEBUG == False:
    DATABASES = {
        "default": dj_database_url.parse(
            url=env("DATABASE_URL"),
            conn_max_age=600, # Optional: controls connection pooling
            conn_health_checks=True # Optional: checks connection health
        )
    }

    # -------------------------------------------------------------------
    # Media files — Backblaze B2 (S3-compatible) via django-storages
    # -------------------------------------------------------------------

    
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

    AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID', default='')
    AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY', default='')
    AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME', default='')
    AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME', default='us-west-004')
    AWS_S3_ENDPOINT_URL = f'https://s3.{AWS_S3_REGION_NAME}.backblazeb2.com' 
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = True  # Generates signed URLs for private buckets
    MEDIA_URL = f'{AWS_S3_ENDPOINT_URL}/{AWS_STORAGE_BUCKET_NAME}/'

    # Security Headers (Uncomment when deploying to production with SSL)
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Production Logging
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'root': {
            'handlers': ['console'],
            'level': 'WARNING',
        },
    }

else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

    MEDIA_URL = 'media/'
    MEDIA_ROOT = BASE_DIR / 'media'



# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:5173')

CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
]
if DEBUG:
    CORS_ALLOWED_ORIGINS.append('http://localhost:5173')
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
]
if DEBUG:
    CSRF_TRUSTED_ORIGINS.append('http://localhost:5173')


# Social Account Settings
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
    },
    'apple': {
        'APP': {
            'client_id': 'com.nexus.app', # Your Service ID
            'secret': 'YOUR_APPLE_CLIENT_SECRET', # Generated from .p8 key
            'key_id': 'APPLE_KEY_ID',
            'team_id': 'APPLE_TEAM_ID',
        }
    }
}

ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
AUTH_USER_MODEL = "user.User"

# Paystack Settings
PAYSTACK_PUBLIC_KEY = env('PAYSTACK_PUBLIC_KEY', default='pk_test_your_public_key')
PAYSTACK_SECRET_KEY = env('PAYSTACK_SECRET_KEY', default='sk_test_your_secret_key')
PAYSTACK_WEBHOOK_SECRET = env('PAYSTACK_WEBHOOK_SECRET', default='your_webhook_secret')

# Email Settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'EduNexus <noreply@edunexus.com>'

# GeoIP Path
GEOIP_PATH = BASE_DIR / 'geoip'

# Token expiry (30 minutes)
PASSWORD_RESET_TIMEOUT = 1800 # 30 minutes in seconds
