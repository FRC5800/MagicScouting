npm run build && ^
npx cap sync android && ^
cd .\android\ && ^
gradlew assembleDebug --profile
