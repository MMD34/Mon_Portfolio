# Zephyr Password Manager

A secure, offline password manager with advanced features for generating and storing passwords safely.

## Features

### Password Generator
- **Custom Passwords**: Generate passwords with customizable length and character sets (uppercase, lowercase, numbers, symbols)
- **Diceware Passphrases**: Generate memorable passphrases using the EFF wordlist (cryptographically secure)
- **Password Strength Meter**: Real-time evaluation of password strength

### Secure Vault
- **Military-Grade Encryption**: AES-128 encryption via Fernet
- **Strong Key Derivation**: Argon2id algorithm (memory-hard, GPU-resistant)
- **Master Password Protection**: Single master password to access all credentials
- **Encrypted Notes**: Store additional information securely with each credential

### Advanced Security
- **Have I Been Pwned Integration**: Check if passwords have been compromised in data breaches
- **K-Anonymity**: HIBP lookups use k-anonymity to protect your passwords
- **Auto-Lock**: Automatically locks after period of inactivity
- **Clipboard Auto-Clear**: Automatically clears clipboard after 30 seconds
- **Password History**: Track previous passwords for each credential

### Data Management
- **Import/Export**: CSV and JSON support for backup and migration
- **Password History**: View previous passwords for each entry
- **Automatic Backups**: Database backups before migrations
- **Version Management**: Automatic database schema upgrades

## For End Users (Using Compiled Version)

### Download and Install

1. Download the latest release:
   - `ZephyrPasswordManager.exe` (Windows)
   - `ZephyrPasswordManager` (macOS/Linux)

2. Download the `assets` folder and place it next to the executable

3. Double-click to run - **no installation required!**

### First Run

1. The application will prompt you to create a **master password**
2. **IMPORTANT**: Remember this password! It cannot be recovered if lost
3. Your master password is never stored - only a cryptographic verifier
4. Start adding your credentials securely

### Your Data Location

Your encrypted vault is stored in a user-specific location:
- **Windows**: `C:\Users\<YourName>\AppData\Local\ZephyrPasswordManager\`
- **macOS**: `~/Library/Application Support/ZephyrPasswordManager/`
- **Linux**: `~/.local/share/ZephyrPasswordManager/`

Each user on the computer has their own separate vault.

### Backup Your Data

To backup your vault:
1. Navigate to the data location above
2. Copy `zephyr_vault.db` to a secure location (USB drive, encrypted cloud storage, etc.)

To restore:
1. Close the application
2. Replace `zephyr_vault.db` with your backup
3. Restart the application

## For Developers (Running from Source)

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd generateur-mdp
   ```

2. **Create virtual environment** (recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify installation**:
   ```bash
   python check_dependencies.py
   ```

5. **Run the application**:
   ```bash
   python main.py
   ```

### Project Structure

```
generateur-mdp/
├── main.py                      # Application entry point
├── app/
│   ├── core/                    # Core logic (password generation, strength)
│   ├── storage/                 # Database, encryption, migrations
│   │   ├── database.py         # Database operations
│   │   ├── encryption.py       # Encryption manager
│   │   ├── migration_manager.py # Schema migration system
│   │   └── path_manager.py     # User-specific data paths
│   ├── utils/                   # Utilities (validation, HIBP)
│   ├── migrations/              # Database migration scripts
│   └── version.py              # Version management
├── assets/
│   └── eff_large_wordlist.txt  # Diceware wordlist
├── requirements.txt            # Python dependencies
├── check_dependencies.py       # Dependency verification script
├── README.md                   # This file
└── DEPLOYMENT.md               # Deployment and compilation guide
```

### Dependencies

- **customtkinter** - Modern UI framework
- **cryptography** - Encryption (Fernet)
- **argon2-cffi** - Password hashing (Argon2id)
- **zxcvbn** - Password strength evaluation
- **pyperclip** - Clipboard operations
- **requests** - HIBP API integration

### Building Executable

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on compiling with PyInstaller.

Quick build:
```bash
pip install pyinstaller
pyinstaller --onefile --windowed --name "ZephyrPasswordManager" main.py
```

## Security Features

### Encryption Details

- **Algorithm**: Fernet (AES-128 in CBC mode with HMAC)
- **Key Derivation**: Argon2id
  - Time cost: 2 iterations
  - Memory cost: 102400 KB (100 MB)
  - Parallelism: 8 threads
- **Salt**: Unique 16-byte random salt per user
- **Verifier**: PBKDF2-HMAC-SHA256 for password verification

### What's Encrypted

- All passwords stored in the vault
- Notes associated with credentials
- Password history

### What's NOT Encrypted

- Site names
- Usernames
- Database schema metadata

This allows for efficient searching while keeping sensitive data protected.

### Master Password Verification

The master password is **never stored**. Instead:
1. A random salt is generated on first setup
2. Your password + salt → derives encryption key (Argon2id)
3. A verifier is created (PBKDF2-HMAC-SHA256)
4. Only the salt and verifier are stored
5. On login, the same derivation is performed and verified

## Version History

### v1.0.0 (2025-10-31)
- Initial release
- Password generator (custom + Diceware)
- Secure encrypted vault
- Have I Been Pwned integration
- Auto-lock feature
- Import/Export (CSV/JSON)
- Password history tracking
- Database migration system
- User-specific data isolation

## License

Copyright © 2025 M'Bello Diallo. All rights reserved.

## Support

For issues or questions:
1. Check `zephyr.log` in your data directory
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting
3. Verify you're using the latest version

## Security Notice

⚠️ **Important Security Practices**:
- Choose a strong master password (12+ characters, mixed case, numbers, symbols)
- Never share your master password
- Keep regular backups of your vault
- Store backups in encrypted locations
- If you forget your master password, your data cannot be recovered
- This application stores data locally - no cloud sync (by design for security)
