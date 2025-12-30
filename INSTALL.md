# Expense Tracker App - Installation Guide

## How to Install and Run on Mobile

### Prerequisites

1. **Node.js** (v18 or later) - [Download](https://nodejs.org/)
2. **Expo Go App** on your mobile device:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## Quick Start

### Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
cd d:\Learning\expense_tracker_mobile
npm install
```

### Step 2: Start the Development Server

```bash
npx expo start
```

This will display a QR code in your terminal.

### Step 3: Open on Mobile

#### Android
1. Open the **Expo Go** app
2. Tap **Scan QR Code**
3. Scan the QR code shown in your terminal

#### iOS
1. Open the **Camera** app
2. Point at the QR code
3. Tap the notification banner to open in Expo Go

---

## Local Network Connection

Make sure your computer and phone are on the **same WiFi network**.

If you have connection issues:
1. Press `s` in the terminal to switch to **Tunnel** mode
2. Or use `npx expo start --tunnel` (requires `@expo/ngrok`)

---

## Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

### iOS

Requires macOS with Xcode:

```bash
eas build -p ios --profile preview
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| QR code not scanning | Use tunnel mode: `npx expo start --tunnel` |
| App stuck on splash | Shake device → Reload |
| Metro bundler error | Delete `node_modules` and reinstall |
| SQLite error on web | Use mobile device - SQLite works best on iOS/Android |

---

## App Features

- **Dashboard**: View weekly/monthly expense charts
- **Expenses**: Filter by date, account, category
- **Accounts**: Add/delete bank accounts & cards
- **Dark/Light Mode**: Toggle in header
- **Erase Data**: Reset all data in Accounts screen

All data is stored locally on your device using SQLite.
