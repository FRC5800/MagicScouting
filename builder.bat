cd .\android\ && ^
keytool -list -keystore .\app\my-release-key.keystore -storepass magic123 -alias launch_magic >nul 2>&1
IF ERRORLEVEL 1 (
    echo Criando keystore...
    keytool -v -genkey -noprompt ^
      -dname "CN=MagicScouting, OU=FRC5800, O=Magic Island, L=Florianopolis, S=SC, C=BR" ^
      -keystore .\app\my-release-key.keystore ^
      -alias launch_magic ^
      -storepass magic123 ^
      -keyalg RSA ^
      -validity 10000
) ELSE (
    echo Alias ja existe.
)
cd ..\ && ^
npm run build && ^
npx cap sync android && ^
cd .\android\ && ^
.\gradlew bundleRelease && ^
.\gradlew assembleRelease && ^
jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore .\app\my-release-key.keystore -storepass magic123 .\app\build\outputs\bundle\release\app-release.aab launch_magic && ^
cd ..\ && ^
7z a -tzip "bundle.zip" ".\build" && ^
gh release create v2.1.3 .\bundle.zip .\android\app\build\outputs\apk\release\app-release.apk#MagicScoutingApk --generate-notes --latest && ^
npx @capawesome/cli apps:liveupdates:register --url https://github.com/FRC5800/MagicScouting/releases/latest/download/bundle.zip --yes --app-id 2eefb088-f3ea-4ac7-87fd-4be4e8d3490c