if [ "$(id -u)" -ne 0 ]; then
    echo "Script not running as root. Attempting to elevate privileges with sudo..."
    exec sudo "$0" "$@" # Re-execute the script with sudo and pass all arguments
    exit 99 # Exit if exec fails
fi

chmod -R 777 /opt/android-sdk/
sdkmanager --sdk_root=$ANDROID_HOME --install "build-tools;34.0.0" "platforms;android-34"

# npm run build
# npx cap sync android
cd ./android/.
./gradlew bundleRelease
./gradlew assembleRelease
# cd ./app/build/outputs/bundle/release/
# jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ./my-release-key.keystore -storepass magic123 ./app-release.aab launch_magic
#
#
# NECESSARIO JAVA 17 openjdk
# NECESSARIO ANDROID_HOME configurado
