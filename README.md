# Starter base

A starting point to help you set up your project quickly and use the common components provided by `react-native-reusables`. The idea is to make it easier for you to get started.

## Features

- NativeWind v4
- Dark and light mode
  - Android Navigation Bar matches mode
  - Persistent mode
- Common components
  - ThemeToggle, Avatar, Button, Card, Progress, Text, Tooltip

<img src="https://github.com/mrzachnugent/react-native-reusables/assets/63797719/42c94108-38a7-498b-9c70-18640420f1bc"
     alt="starter-base-template"
     style="width:270px;" />


android:usesCleartextTraffic="true"

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

cd android
./gradlew assembleRelease