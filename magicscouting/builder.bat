npm run build && ^
npx cap sync android && ^
cd .\android\ && ^
gradlew bundleRelease && ^
gradlew assembleRelease && ^
cd .\app\build\outputs\bundle\release\ && ^
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore .\my-release-key.keystore -storepass magic123 .\app-release.aab launch_magic