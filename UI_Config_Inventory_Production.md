# NetSapiens UI Configuration Inventory for Production

## Grid4 Communications - Master UI Settings Analysis
Generated from: UI_Config_grid4voice1751401080.csv (517 settings)

---

## 🎨 BRANDING & CUSTOMIZATION

### CSS/JS Injection (Critical for Grid4 Skin)
```
PORTAL_CSS_CUSTOM - Custom CSS file URL
PORTAL_EXTRA_JS - Custom JavaScript file URL
```
**Current Usage:** Multiple domains using Grid4 skin from CDN/Azure Static Web Apps

### Theme Colors
```
PORTAL_CSS_PRIMARY_2 = #6EC1E4
PORTAL_THEME_PRIMARY = #6EC1E4
PORTAL_THEME_ACCENT = #242729
PORTAL_CSS_COLOR_MENU_BAR = no
```

### Branding Text
```
PORTAL_LOGGED_IN_POWERED_BY = "Grid4 Communications"
```

---

## 📱 MOBILE & WEBPHONE SETTINGS

### Mobile App Configuration
```
MOBILE_ANDROID_CALL_CENTER_ENABLED = yes
MOBILE_ANDROID_FEEDBACK_EMAIL = bphelps@grid4.com
MOBILE_ANDROID_GROUP_CHAT_ENABLED = yes
MOBILE_ANDROID_MULTIMEDIA_CHAT_ENABLED = yes
MOBILE_ANDROID_RECORD_ALLOW = yes
MOBILE_IOS_CALL_CENTER_ENABLED = yes
MOBILE_IOS_FEEDBACK_EMAIL = bphelps@grid4.com
MOBILE_IOS_GROUP_CHAT_ENABLED = yes
MOBILE_IOS_MULTIMEDIA_CHAT_ENABLED = yes
MOBILE_IOS_RECORD_ALLOW = yes
MOBILE_REGISTRATION_SERVER = _sip._tls.core1-ord.grid4voice.ucaas.tech:5061
MOBILE_REVERSE_NAME_DISPLAY_ORDER = yes
```

### WebPhone (SNAPmobile Web)
```
PORTAL_ALLOW_WEB_PHONE = yes
PORTAL_ALLOW_WEB_PHONE_TOOLBAR = yes
PORTAL_WEB_PHONE_NAME = "SNAPmobile Web"
PORTAL_WEBPHONE_ENABLE_PWA = yes
PORTAL_WEBPHONE_NEW_TAB_VIEW = yes
PORTAL_WEB_PHONE_SHOW_CHATSMS = yes
PORTAL_PHONES_SNAPMOBILE_ALLOW = yes
PORTAL_PHONES_SNAPMOBILE_HOSTID = gridfourvoicesb
PORTAL_PHONES_SNAPMOBILE_TITLE = "Grid4 Mobile"
```

### PWA Configuration
```
PORTAL_WEBPHONE_PWA_BACKGROUND_COLOR = #FFFFFF
PORTAL_WEBPHONE_PWA_DESCRIPTION = grid4voice_UC
PORTAL_WEBPHONE_PWA_NAME = grid4voice_PWA
PORTAL_WEBPHONE_PWA_SHORT_NAME = grid4voice_PWA
PORTAL_WEBPHONE_PWA_THEME_COLOR = #6EC1E4
```

---

## 🔒 SECURITY & CSP

### Content Security Policy
```
PORTAL_CSP_ENABLED = no
PORTAL_CSP_CONNECT_ADDITIONS = "https://cdn.statically.io https://statically.io wss://*.socket.io https://ambitious-coast-0a8b2110f.1.azurestaticapps.net https://*.azurestaticapps.net"
PORTAL_CSP_FONT_ADDITIONS = "https://fonts.gstatic.com https://fonts.googleapis.com https://*.gstatic.com"
PORTAL_CSP_IMG_ADDITIONS = "https://grid4.com https://cdn.statically.io https://statically.io https://*.githubusercontent.com https://raw.githubusercontent.com https://ambitious-coast-0a8b2110f.1.azurestaticapps.net https://*.azurestaticapps.net"
PORTAL_CSP_SCRIPT_ADDITIONS = "https://*.statically.io https://statically.io https://*.githubusercontent.com https://*.jsdelivr.net https://*.github.com https://*.google-analytics.com https://*.googletagmanager.com https://ambitious-coast-0a8b2110f.1.azurestaticapps.net https://*.azurestaticapps.net"
PORTAL_CSP_STYLE_ADDITIONS = "https://cdn.statically.io https://statically.io https://*.githubusercontent.com https://raw.githubusercontent.com https://fonts.googleapis.com https://*.bootstrap.com https://ambitious-coast-0a8b2110f.1.azurestaticapps.net https://*.azurestaticapps.net"
```

### Authentication & MFA
```
PORTAL_MFA_FEATURE_ENABLED = yes
UI_ADMIN_USE_MD5_PASSWORD = yes
```

---

## 📞 CALL CENTER & QUEUES

### Call Center Features
```
PORTAL_AGENT_SHOW_AGENT_ACW = yes
PORTAL_CALL_QUEUE_AGENTS_BY_USER = yes
PORTAL_CALL_QUEUE_AGENT_MESSAGE = yes
PORTAL_CALL_QUEUE_ALLOW_DID_MANAGE = yes
PORTAL_CALL_QUEUE_ALLOW_RECORDING = yes
PORTAL_CALL_QUEUE_CALLBACK_ALLOW = yes
PORTAL_CALL_QUEUE_GRANULAR_LOGIN = yes
PORTAL_CALL_QUEUE_INTRO_FORCED = yes
PORTAL_CALL_QUEUE_MANAGER_EMAIL = yes
PORTAL_CALL_QUEUE_RINGBACK_OR_MOH = yes
PORTAL_CALL_QUEUE_USE_SITE = yes
PORTAL_MENU_SHOW_CALL_CENTER_AGENT = yes
PORTAL_MENU_SHOW_CALL_CENTER_AGENT_SUPERVISOR = yes
```

### Agent Features
```
PORTAL_CALLS_ACTIVE_CALL_POPUPS = yes (Call Center Agent role)
PORTAL_CALL_POPUP_ENABLED = yes
PORTAL_CALL_POPUP_SHOW_DISP_NOTES = yes (Call Center Agent role)
PORTAL_CALL_POPUP_SHOW_NOTES = yes (Call Center Agent role)
```

---

## 🎵 AUDIO & RECORDING

### Recording Settings
```
PORTAL_CALL_RECORDING = yes
PORTAL_DEVICE_ALLOW_RECORDING = yes
PORTAL_USERS_ALLOW_RECORDING = yes
RECORDINGS_PLAYBACK_URL = https://core1-ord.grid4voice.ucaas.tech/LiCf/playback.php
RECORDINGS_PLAYBACK_VIA_URL = yes
RECORDINGS_PLAYBACK_UID = Playback
RECORDINGS_PLAYBACK_PWD = Playback
USE_LIDF_FOR_RECORDINGS = yes
```

### Music/MOH Upload
```
UI_ALLOW_MOH_UPLOAD = yes
PORTAL_MUSIC_COPYWRITE_TEXT = "By using the music upload feature, you acknowledge that you are solely responsible for ensuring your audio files are properly licensed and free from copyright restrictions. Grid4 Communications does not assume liability for the content you provide, and reserves the right to review and remove any content found to be in violation of copyright laws or our policies."
```

### Call Monitoring
```
PORTAL_ALLOW_AUDIO_MONITOR = yes
PORTAL_ALLOW_AUDIO_MONITOR_ON_AGENTS = yes
PORTAL_ALLOW_AUDIO_MONITOR_ON_QUEUES = yes
PORTAL_ALLOW_WHISPER_BARGE = no
```

---

## 🎙️ VOICE AI FEATURES

### Text-to-Speech
```
PORTAL_VOICE_TEXT_TO_SPEECH = yes
PORTAL_VOICE_TEXT_TO_SPEECH_AZURE = yes
PORTAL_VOICE_TEXT_TO_SPEECH_GOOGLE_STANDARD = yes
PORTAL_VOICE_TEXT_TO_SPEECH_GOOGLE_WAVENET = yes
PORTAL_VOICE_TEXT_TO_SPEECH_POLLY = yes
PORTAL_VOICE_TEXT_TO_SPEECH_WATSON = yes
```

### Speech-to-Text/Transcription
```
PORTAL_VOICE_SPEECH_TO_TRANSCRIPTION = yes
PORTAL_VOICE_SPEECH_TO_TRANSCRIPTION_VENDOR = deepgram
PORTAL_VOICE_SPEECH_TO_TRANSCRIPTION_SUMMARY_VENDOR = deepgram
PORTAL_VOICE_SPEECH_TO_TRANSCRIPTION_TOPICS_VENDOR = deepgram
PORTAL_USERS_VMAIL_TRANSCRIPTION_DEEPGRAM = yes
PORTAL_USERS_VMAIL_TRANSCRIPTION_DEEPGRAM_NAME = Deepgram
PORTAL_USERS_VMAIL_TRANSCRIPTION_SHOW = yes
```

### Sentiment Analysis
```
PORTAL_VOICE_TRANSCRIPTION_SENTIMENT = yes
PORTAL_VOICE_TRANSCRIPTION_SENTIMENT_ENDING_SECONDS = 30
PORTAL_VOICE_TRANSCRIPTION_SENTIMENT_VENDOR = deepgram
```

---

## 👤 USER MANAGEMENT

### User Creation Defaults
```
PORTAL_USERS_CREATE_DEFAULT_FEATURE = yes
PORTAL_USERS_CREATE_DEFAULT_FEATURE_SIM_RING = yes
PORTAL_USERS_MIN_PASSWORD_LENGTH = 4
PORTAL_USERS_SECURE_PASSWORD_STRONG = yes
PORTAL_USERS_SECURE_PASSWORD_MIN_LENGTH = 8
PORTAL_USERS_SECURE_PASSWORD_MIN_CAPITAL_LETTER_COUNT = 1
PORTAL_USERS_SECURE_PASSWORD_MIN_NUMBER_COUNT = 1
PORTAL_USERS_SECURE_PASSWORD_MIN_SPECIAL_CHAR_COUNT = 0
PORTAL_USERS_PIN_STRONG = yes
```

### Forbidden Lists
```
PORTAL_USER_PIN_FORBID_LIST = "0000,1111,2222,3333,4444,5555,6666,7777,8888,9999,1234,4321,5678,8765..."
PORTAL_USER_SECURE_PASSWORD_EXTENSION_FORBID_LIST = "0000,1111,2222,3333,4444,5555,6666,7777,8888,9999,1234,4321,5678,8765..."
```

### User Features
```
PORTAL_USERS_ALLOW_IMPORT = yes
PORTAL_USERS_ALLOW_EXPORT = yes (Super User role)
PORTAL_USERS_ALLOW_PASSWORD_CHANGE = yes (Super User role)
PORTAL_USERS_ALLOW_PASSWORD_CHANGE_ON_EDIT = yes
PORTAL_USERS_ALLOW_PASSWORD_CHANGE_ON_RESET = yes
PORTAL_USERS_RINGGROUP = yes
PORTAL_USERS_SORT_EXTENSION = yes
```

---

## 📊 ANALYTICS & REPORTING

### Analytics
```
PORTAL_ANALYTICS_FEATURE_ENABLED = yes
ANALYTICS_ENABLE_AGENTS_ACCESS = yes
ANALYTICS_EXTRA_STYLE_CONTROLS = yes
```

### Call History
```
PORTAL_CALLHISTORY_MAX_RANGE_DAYS = 90
PORTAL_CALLHISTORY_FILTERS_EXT_TO_EXT = yes
PORTAL_CALLHISTORY_FILTERS_OFFNET = yes
PORTAL_CALLHISTORY_FILTERS_SITE = yes
PORTAL_CALLHISTORY_SHOW_RECORDING_STORAGE = yes
PORTAL_CALL_HISTORY_SHOW_QOS = yes
PORTAL_CALL_HISTORY_SHOW_RECORDINGS = yes
PORTAL_CALL_HISTORY_SHOW_RELEASE_REASON = yes
PORTAL_CALL_HISTORY_SHOW_TRACE_OMP = yes
```

### Export Options
```
PORTAL_CALL_HISTORY_EXPORT_DISP_REASON_NOTES = yes
PORTAL_CALL_HISTORY_EXPORT_PAC = yes
PORTAL_CALL_HISTORY_EXPORT_RELEASE_REASON = yes
PORTAL_CALL_HISTORY_EXPORT_SPLIT_DAY_TIME = yes
```

---

## 🚨 EMERGENCY SERVICES

### 911 Configuration
```
PORTAL_DOMAINS_ALLOW_EDIT_911ID = yes
PORTAL_DOMAINS_EMERGENCY_TAB = yes
PORTAL_PHONES_SHOW_911ID = yes
PORTAL_USERS_911_USE_DROPDOWN_EMERG_LIST = no
```

### Emergency Notifications
```
PORTAL_EMERGENCY_NOTIFICATION_DIAL_NUMBERS = "911,933"
PORTAL_EMERGENCY_NOTIFICATION_MESSAGE = yes
PORTAL_EMERGENCY_NOTIFICATION_SHOW_CALL = yes
PORTAL_EMERGENCY_NOTIFICATION_SHOW_EMAIL = yes
PORTAL_EMERGENCY_NOTIFICATION_SHOW_MESSAGE = yes
PORTAL_SITES_EMERGENCY_NOTIFICATIONS = yes
```

---

## 🏢 MULTI-TENANT & SITES

### Site Management
```
PORTAL_ENABLE_SITE_MANAGER = yes
PORTAL_SITES_MASTER = yes
PORTAL_SHOW_DEVICE_DEFAULTS_SITE = yes
```

### Domain Configuration
```
PORTAL_DOMAINS_DIAL_PERMISSION = "US and Canada"
PORTAL_DOMAINS_DIAL_PLAN = "Cloud PBX Features"
PORTAL_DOMAINS_NDP_SERVER_SELECT = yes
PORTAL_DOMAIN_CREATE_NAME_STRICT_VALIDATION = yes
PORTAL_FQDN = portal.grid4voice.ucaas.tech
```

---

## 🔧 ADVANCED FEATURES

### SNAPbuilder
```
PORTAL_BUILDER_ENABLED = yes
PORTAL_BUILDER_FEATURE_NAME = SNAPbuilder
PORTAL_BUILDER_VIEW_CONFIG_FILES_ENABLED = yes
```

### Video (SNAPHD)
```
PORTAL_VIDEO = yes
```

### Chat/SMS
```
PORTAL_CHAT_SMS = yes
PORTAL_CHAT_UC = yes
PORTAL_MMS_GROUP_MESSAGING_SUPPORTED_CARRIERS = "bandwidth,inteliquent,brightlink"
```

### Inventory Management
```
PORTAL_INVENTORY_ALLOW_PSTN = yes
PORTAL_INVENTORY_ALLOW_RESYNC_ON_SAVE = yes
PORTAL_INVENTORY_ALLOW_ROUTE_PROFILES = yes
PORTAL_INVENTORY_ALLOW_SIP_TRUNKS = yes
PORTAL_INVENTORY_PHONENUMBERS_IMPORT = yes
PORTAL_INVENTORY_PHONENUMBER_ALLOW_ADD = yes
PORTAL_INVENTORY_PHONES_REGISTRATION_STATUS = yes
```

---

## 🎛️ UI PREFERENCES

### Table Settings
```
DEFAULT_UI_TABLE_MAX_ROW = 50
```

### Performance
```
PORTAL_JS_COMBINE = yes
```

### Socket Configuration
```
PORTAL_SOCKET_HOSTNAME = "portal.grid4voice.ucaas.tech,api.grid4voice.ucaas.tech"
```

### Core Services
```
WS_SERVERS = "core1-ord.grid4voice.ucaas.tech,core2-ord.grid4voice.ucaas.tech"
PORTAL_DEVICE_NDP_SERVER = core1 (default), core2 (for grid4lab domain)
```

---

## 📋 ROLE-SPECIFIC SETTINGS

### Super User Permissions
```
PORTAL_ASSUME_IDENTITY = yes
PORTAL_DOMAINS_RECORDING_QUOTA = yes
PORTAL_DOMAINS_RECORDING_QUOTA_AGELIMIT = yes
PORTAL_DOMAINS_RECORDING_QUOTA_COUNTLIMIT = yes
PORTAL_DOMAINS_RECORDING_QUOTA_SIZELIMIT = yes
PORTAL_DOMAINS_RECORDING_QUOTA_TIMELIMIT = yes
PORTAL_SHOW_DOMAIN_BLOCKED_NUMBERS = yes
PORTAL_SHOW_DOMAIN_BLOCKED_NUMBERS_MODAL = yes
PORTAL_INVENTORY_PHONES_TRANSPORT_TYPE = yes
PORTAL_INVENTORY_SHOW_OVERRIDES = yes
PORTAL_PHONES_SHOW_CONTACT = full
PORTAL_PHONES_SHOW_OVERRIDES = yes
```

### Reseller Permissions
```
PORTAL_ASSUME_IDENTITY = yes
PORTAL_ALLOW_SCOPE_SELECT_RESELLER = yes
PORTAL_PHONES_SHOW_CONTACT = full
PORTAL_SHOW_DEVICE_DEFAULTS_DOMAIN = yes
PORTAL_SHOW_DEVICE_DEFAULTS_SITE = yes
```

---

## 🚀 IMPLEMENTATION RECOMMENDATIONS

### Priority 1 - Essential for Grid4 Skin
1. **PORTAL_CSS_CUSTOM** - Set to your production CSS URL
2. **PORTAL_EXTRA_JS** - Set to your production JS URL
3. **PORTAL_CSP_*** settings - Configure if enabling CSP
4. **PORTAL_LOGGED_IN_POWERED_BY** - "Grid4 Communications"

### Priority 2 - Mobile & WebPhone
5. All **MOBILE_*** settings for app configuration
6. All **PORTAL_WEBPHONE_*** settings for PWA
7. **PORTAL_PHONES_SNAPMOBILE_*** settings

### Priority 3 - Core Features
8. Call Center/Queue settings
9. Recording configuration
10. Voice AI features (TTS, STT, Transcription)
11. User management defaults
12. Emergency service settings

### Priority 4 - Advanced Features
13. Analytics configuration
14. SNAPbuilder settings
15. Video/Chat/SMS features
16. Multi-tenant/Site management

---

## 📝 NOTES

1. **Domain-Specific Settings**: Some settings are configured per-domain (netsapiens, Grid4_Monday_test, etc.)
2. **Role-Based Settings**: Many settings vary by user role (Super User, Reseller, Call Center Agent)
3. **Login Type Variations**: Settings can differ by login type (admin, domain, subscriber, tac, territory)
4. **Default Values**: Many settings marked with "Created via API" are likely system defaults

---

## 🔄 MIGRATION CHECKLIST

- [ ] Review all Priority 1 settings
- [ ] Update CSS/JS URLs for production
- [ ] Configure mobile app settings
- [ ] Set up webphone/PWA branding
- [ ] Enable required call center features
- [ ] Configure recording settings
- [ ] Set up voice AI vendors
- [ ] Review security settings
- [ ] Configure emergency services
- [ ] Test with different user roles

---

Generated on: 2025-07-01
Total Settings Analyzed: 517