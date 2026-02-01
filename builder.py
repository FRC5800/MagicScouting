#!/usr/bin/env python3
"""
Cross-platform build script for MagicScouting Android app.
Replaces builder.bat with cross-platform Python implementation.
"""

import os
import sys
import subprocess
import platform
import argparse
import shutil
from pathlib import Path

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # If python-dotenv is not installed, try to read .env manually
    env_file = Path(__file__).parent / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# Get app-id from environment variable
APP_ID = os.getenv('CAPACITOR_APP_ID')


def ensure_env_file():
    """Create .env file if it doesn't exist."""
    env_file = Path(__file__).parent / '.env'
    if not env_file.exists():
        raise Exception("ENV File does not exist. Create it to continue")
    return None

# Determine OS-specific commands
IS_WINDOWS = platform.system() == 'Windows'
IS_MAC = platform.system() == 'Darwin'
IS_LINUX = platform.system() == 'Linux'

# Paths
PROJECT_ROOT = Path(__file__).parent.resolve()
ANDROID_DIR = PROJECT_ROOT / 'android'
KEYSTORE_PATH = ANDROID_DIR / 'app' / 'my-release-key.keystore'
KEYSTORE_ALIAS = 'launch_magic'
KEYSTORE_PASSWORD = 'magic123'
BUNDLE_PATH = ANDROID_DIR / 'app' / 'build' / 'outputs' / 'bundle' / 'release' / 'app-release.aab'
APK_PATH = ANDROID_DIR / 'app' / 'build' / 'outputs' / 'apk' / 'release' / 'app-release.apk'
BUILD_DIR = PROJECT_ROOT / 'build'
BUNDLE_ZIP = PROJECT_ROOT / 'bundle.zip'

# Gradle wrapper command
GRADLEW = 'gradlew.bat' if IS_WINDOWS else './gradlew'
ZIP_CMD = '7z' if IS_WINDOWS else 'zip'


def find_executable(cmd):
    """Find the full path to an executable."""
    if isinstance(cmd, list):
        cmd = cmd[0]
    
    # Check if it's already a full path
    if os.path.isabs(cmd) and os.path.exists(cmd):
        return cmd
    
    # Try to find it in PATH
    found = shutil.which(cmd)
    if found:
        return found
    
    return cmd


def run_command(cmd, cwd=None, check=True, shell=None):
    """Run a shell command and handle errors."""
    original_cmd = cmd
    if isinstance(cmd, str):
        cmd_str = cmd
        cmd = cmd.split()
    else:
        cmd_str = ' '.join(cmd)
    
    # On Windows, for npm/npx/gh/7z commands, use shell=True
    # For other commands, try to find the executable first
    if IS_WINDOWS:
        # Commands that typically need shell=True on Windows
        shell_commands = ['npm', 'npx', 'gh', '7z']
        first_cmd = cmd[0] if cmd else ''
        
        if first_cmd in shell_commands:
            shell = True
            # When using shell=True on Windows, use string format
            cmd = cmd_str
        elif shell is None:
            # Try to find the executable
            found = find_executable(first_cmd)
            if found != first_cmd:
                cmd[0] = found
            shell = False
        else:
            shell = shell
            if shell:
                cmd = cmd_str
    else:
        shell = shell if shell is not None else False
    
    print(f"Running: {cmd_str if isinstance(cmd, str) else ' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd or PROJECT_ROOT,
            check=check,
            shell=shell,
            capture_output=False
        )
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        return False
    except FileNotFoundError as e:
        print(f"Command not found: {e}")
        print(f"Make sure '{cmd[0] if isinstance(cmd, list) and cmd else 'command'}' is installed and in your PATH")
        return False


def check_keystore_exists():
    """Check if keystore already exists."""
    if not KEYSTORE_PATH.exists():
        return False
    
    # Try to list the keystore to verify it's valid
    cmd = [
        'keytool',
        '-list',
        '-keystore', str(KEYSTORE_PATH),
        '-storepass', KEYSTORE_PASSWORD,
        '-alias', KEYSTORE_ALIAS
    ]
    
    result = subprocess.run(
        cmd,
        cwd=ANDROID_DIR,
        capture_output=True,
        text=True
    )
    
    return result.returncode == 0


def create_keystore():
    """Create Android keystore if it doesn't exist."""
    if check_keystore_exists():
        print("Keystore alias already exists.")
        return True
    
    print("Creating keystore...")
    cmd = [
        'keytool',
        '-v',
        '-genkey',
        '-noprompt',
        '-dname', 'CN=MagicScouting, OU=FRC5800, O=Magic Island, L=Florianopolis, S=SC, C=BR',
        '-keystore', str(KEYSTORE_PATH),
        '-alias', KEYSTORE_ALIAS,
        '-storepass', KEYSTORE_PASSWORD,
        '-keyalg', 'RSA',
        '-validity', '10000'
    ]
    
    return run_command(cmd, cwd=ANDROID_DIR)


def build_project():
    """Build the Svelte project."""
    print("\n=== Building project ===")
    return run_command(['npm', 'run', 'build'])


def sync_capacitor():
    """Sync Capacitor with native projects."""
    print("\n=== Syncing Capacitor ===")
    return run_command(['npx', 'cap', 'sync', 'android'])


def build_android_bundle():
    """Build Android bundle and APK."""
    print("\n=== Building Android bundle ===")
    gradlew_cmd = GRADLEW if IS_WINDOWS else f'./{GRADLEW}'
    
    # Build bundle
    if not run_command([gradlew_cmd, 'bundleRelease'], cwd=ANDROID_DIR, shell=IS_WINDOWS):
        return False
    
    # Build APK
    if not run_command([gradlew_cmd, 'assembleRelease'], cwd=ANDROID_DIR, shell=IS_WINDOWS):
        return False
    
    return True


def sign_bundle():
    """Sign the Android bundle."""
    print("\n=== Signing bundle ===")
    if not BUNDLE_PATH.exists():
        print(f"Error: Bundle not found at {BUNDLE_PATH}")
        return False
    
    cmd = [
        'jarsigner',
        '-sigalg', 'SHA1withRSA',
        '-digestalg', 'SHA1',
        '-keystore', str(KEYSTORE_PATH),
        '-storepass', KEYSTORE_PASSWORD,
        str(BUNDLE_PATH),
        KEYSTORE_ALIAS
    ]
    
    return run_command(cmd)


def create_zip():
    """Create zip file from build directory."""
    print("\n=== Creating zip file ===")
    if not BUILD_DIR.exists():
        print(f"Error: Build directory not found at {BUILD_DIR}")
        return False
    
    # Remove existing zip if it exists
    if BUNDLE_ZIP.exists():
        BUNDLE_ZIP.unlink()
    
    if IS_WINDOWS:
        # Use 7z on Windows
        cmd = ['7z', 'a', '-tzip', str(BUNDLE_ZIP), str(BUILD_DIR)]
    else:
        # Use zip on Unix systems
        cmd = ['zip', '-r', str(BUNDLE_ZIP), str(BUILD_DIR.name)]
        cwd = BUILD_DIR.parent
    
    return run_command(cmd, cwd=BUILD_DIR.parent if not IS_WINDOWS else None, shell=IS_WINDOWS)


def create_github_release(version='v2.1.3'):
    """Create GitHub release with bundle and APK."""
    print("\n=== Creating GitHub release ===")
    
    if not BUNDLE_ZIP.exists():
        print(f"Error: Bundle zip not found at {BUNDLE_ZIP}")
        return False
    
    if not APK_PATH.exists():
        print(f"Error: APK not found at {APK_PATH}")
        return False
    
    cmd = [
        'gh', 'release', 'create', version,
        str(BUNDLE_ZIP),
        f'{APK_PATH}#MagicScoutingApk',
        '--generate-notes',
        '--latest'
    ]
    
    return run_command(cmd)


def register_live_updates(version='v2.1.3'):
    """Register live updates with Capacitor."""
    print("\n=== Registering live updates ===")
    
    url = f'https://github.com/FRC5800/MagicScouting/releases/latest/download/bundle.zip'
    
    cmd = [
        'npx',
        '@capawesome/cli',
        'apps:liveupdates:register',
        '--url', url,
        '--yes',
        '--app-id', APP_ID
    ]
    
    return run_command(cmd)


def main():
    """Main build process."""
    global APP_ID
    
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Build script for MagicScouting Android app',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='Example: python builder.py --version v2.1.4'
    )
    parser.add_argument(
        '--version',
        '-v',
        type=str,
        default='v2.1.3',
        help='Version tag for the release (default: v2.1.3)'
    )
    
    args = parser.parse_args()
    version = args.version
    
    # Ensure version starts with 'v' if not provided
    if not version.startswith('v'):
        version = f'v{version}'
    
    # Ensure .env file exists
    created_app_id = ensure_env_file()
    if created_app_id:
        # Reload environment if we just created the file
        env_file = Path(__file__).parent / '.env'
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key.strip()] = value.strip()
        APP_ID = os.getenv('CAPACITOR_APP_ID', created_app_id)
    
    print("=" * 50)
    print("MagicScouting Build Script")
    print("=" * 50)
    print(f"Platform: {platform.system()}")
    print(f"App ID: {APP_ID}")
    print(f"Release Version: {version}")
    print("=" * 50)
    
    # Step 1: Create keystore if needed
    if not create_keystore():
        print("Failed to create keystore. Exiting.")
        sys.exit(1)
    
    # Step 2: Build project
    if not build_project():
        print("Failed to build project. Exiting.")
        sys.exit(1)
    
    # Step 3: Sync Capacitor
    if not sync_capacitor():
        print("Failed to sync Capacitor. Exiting.")
        sys.exit(1)
    
    # Step 4: Build Android bundle and APK
    if not build_android_bundle():
        print("Failed to build Android bundle. Exiting.")
        sys.exit(1)
    
    # Step 5: Sign bundle
    if not sign_bundle():
        print("Failed to sign bundle. Exiting.")
        sys.exit(1)
    
    # Step 6: Create zip
    if not create_zip():
        print("Failed to create zip file. Exiting.")
        sys.exit(1)
    
    # Step 7: Create GitHub release
    if not create_github_release(version=version):
        print("Failed to create GitHub release. Exiting.")
        sys.exit(1)
    
    # Step 8: Register live updates
    if not register_live_updates(version=version):
        print("Failed to register live updates. Exiting.")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("Build completed successfully!")
    print("=" * 50)


if __name__ == '__main__':
    main()