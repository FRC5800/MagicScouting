npm run build && ^
npx cap sync android && ^
cd .\android\ && ^
gradlew bundleRelease && ^
cd .\app\build\outputs\bundle\release\ && ^
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore -storepass magic123 .\app-release.aab launch_magic
