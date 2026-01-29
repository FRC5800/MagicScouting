#!/usr/bin/env bash
set -e

#####################################
# AUTO SUDO
#####################################


#####################################
# VARIÁVEIS
#####################################
APP_NAME="MagicScouting"
ANDROID_PLATFORM="android-34"
BUILD_TOOLS="34.0.0"

PROJECT_ROOT="$(pwd)"
ANDROID_DIR="$PROJECT_ROOT/android"

#####################################
# CHECKS
#####################################

echo "🔍 Verificando Java..."

# if ! java -version 2>&1 | grep -q "17"; then
#     echo "❌ Java 17 não encontrado"
#     echo "Instale com:"
#     echo "  sudo pacman -S jdk17-openjdk   # Arch"
#     echo "  sudo apt install openjdk-17-jdk # Debian/Ubuntu"
#     exit 1
# fi

# echo "✅ Java 17 OK"

if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME não está definido"
    echo "Adicione no ~/.bashrc ou ~/.zshrc:"
    echo 'export ANDROID_HOME=/opt/android-sdk'
    echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools'
    exit 1
fi

echo "✅ ANDROID_HOME = $ANDROID_HOME"

#####################################
# SDK SETUP
#####################################

echo "📦 Verificando SDKs instalados (sem root)..."
#####################################
# BUILD WEB (SVELTE 5)
#####################################

echo "🌐 Buildando app web (Svelte)..."

npm install
npm run build

#####################################
# CAPACITOR SYNC
#####################################

echo "🔗 Sincronizando Capacitor..."
npx cap sync android

#####################################
# ANDROID BUILD
#####################################

cd "$ANDROID_DIR"

echo "🏗️ Buildando APK (assembleRelease)..."
./gradlew assembleDebug

# echo "🏗️ Buildando AAB (bundleRelease)..."
# ./gradlew bundleRelease

#####################################
# OUTPUT
#####################################

echo ""
echo "✅ BUILD FINALIZADO"
echo ""
# echo "📦 AAB:"
# echo "android/app/build/outputs/bundle/release/app-release.aab"
# echo ""
echo "📦 APK:"
echo "android/app/build/outputs/apk/release/app-release.apk"
echo ""

#####################################
# ASSINATURA (OPCIONAL)
#####################################

# Para ativar, descomente e ajuste:

# KEYSTORE_PATH="./my-release-key.keystore"
# KEY_ALIAS="launch_magic"
# STORE_PASS="magic123"
# KEY_PASS="magic123"

# jarsigner -verbose \
#   -sigalg SHA256withRSA \
#   -digestalg SHA-256 \
#   -keystore "$KEYSTORE_PATH" \
#   -storepass "$STORE_PASS" \
#   -keypass "$KEY_PASS" \
#   android/app/build/outputs/bundle/release/app-release.aab \
#   "$KEY_ALIAS"

# echo "🔏 AAB assinado com sucesso"

#####################################
# FINAL
#####################################

echo "🚀 Pronto para upload na Play Store"
