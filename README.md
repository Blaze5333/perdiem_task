# Per Diem Store Appointment Booking App

![Per Diem App Banner](https://via.placeholder.com/800x400?text=Per+Diem+App)

## Overview

Per Diem is a React Native mobile application designed for booking appointments at a physical store located in New York City. The app features robust timezone handling, allowing users to book appointments in either NYC time or their local timezone. The app provides real-time information about store availability, supports special store hour overrides (like holidays), and includes a notification system.

## Demo Videos

### Part 1
[Watch Part 1 on Loom](https://www.loom.com/share/554db66a6eb44aa68f425de2be9e14f9?sid=b94d17f8-35de-4a3d-8c22-93cf877ce068)


### Part 2
[Watch Part 2 on Loom](https://www.loom.com/share/afdfbf7458c74c078b06a04616e9898b?sid=ce536be3-6186-4d4e-adac-f7e486f8ec69)

### Part 3
[Watch Part 3 on Loom](https://www.loom.com/share/fc402ccefcca4faf88a3ccdd65b5ac1a?sid=923eface-71f2-46b1-9e0e-6e60990d7232)

## Key Features

### Timezone-Aware Appointment Booking
- Toggle between NYC and local timezone
- All times are automatically converted when switching timezones
- Selected date and time are preserved when toggling between timezones

### Store Hours Visualization
- Green dot for open time slots, red dot for closed time slots
- Special handling for store hour overrides (holidays, special events)
- Shows the next available opening time when the store is closed

### Store Status Card
- Displays current store status (open/closed)
- Shows selected appointment date and time
- Provides next available time slot if the store is closed

### Next Opening Notification
- Card showing the next time the store will open
- "Notify Me" button to receive a notification one hour before the store opens
- Firebase-based notification system

### User Authentication
- Google Sign-In integration
- Email and password authentication
- User profile management

### Modern UI/UX
- Sleek and elegant design
- Animated components for a better user experience
- Responsive layout for different devices

## Technologies Used

- React Native
- Redux for state management
- Moment-timezone for timezone handling
- Firebase Authentication
- Firebase Cloud Messaging for notifications
- React Navigation for routing
- Animated API for smooth transitions

## Project Structure

```
app/
├── apis/                    # API integration
├── assets/                  # Images, fonts, etc.
├── components/              # Reusable UI components
│   ├── AnimatedTimezoneToggle.js
│   ├── DatePickerModal.js
│   ├── DateTimeSelector.js
│   ├── GreetingCard.js
│   ├── HomeHeader.js
│   ├── ModalContainer.js
│   ├── NextOpeningCard.js
│   ├── StoreStatusCard.js
│   └── TimePickerModal.js
├── navigation/              # Navigation setup
│   ├── index.js
│   └── StackNavigation.js
├── redux/                   # Redux state management
│   ├── index.js
│   └── userSlice.js
├── screens/                 # App screens
│   ├── Home.js
│   └── Login.js
├── services/                # Service modules
│   ├── api/
│   │   ├── client.js        # API client
│   │   └── storeService.js  # Store data service
│   └── NotificationService.js
└── utils/                   # Utility functions
    ├── dateTimeUtils.js     # Date/time manipulation
    ├── getTimeZoneHours.js  # Timezone conversion
    ├── storeOverridesUtil.js # Store override handling
    └── timeUtils.js         # Time-related utilities
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase project (for authentication and notifications)

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Blaze5333/perdiem_task.git
cd perdiem_task
```

2. Install dependencies:
```bash
yarn install
```

3. Install iOS dependencies (Mac only):
```bash
cd ios && pod install && cd ..
```

4. Start the Metro server:
```bash
yarn start
```

5. Launch the app:
```bash
# For iOS
# Press 'i' in the Metro server terminal

# For Android
# Press 'a' in the Metro server terminal
```

## Authentication Setup

### Google Sign-In
1. Create a Firebase project and enable Google Authentication
2. Configure the OAuth consent screen in Google Cloud Console
3. Add the necessary configuration in `android/app/google-services.json` and `ios/GoogleService-Info.plist`
4. Enable Google Sign-In in the Firebase Authentication console

### Email/Password Authentication
1. Enable Email/Password authentication in Firebase Authentication console
2. Implement validation for email format and password strength
3. Set up password recovery flow via email

## API Integration

The app connects to a backend service to fetch store hours and store overrides. The API structure includes:

- `GET /store-hours` - Fetches regular store hours by day of week
- `GET /store-overrides` - Fetches special store hour overrides (holidays, special events)

## Timezone Handling

The app uses moment-timezone to handle timezone conversions between NYC time (America/New_York) and the user's local timezone:

1. Store hours are defined in NYC timezone
2. When toggling to local timezone, all times are converted accordingly
3. When selecting a date/time, the app checks if the store is open in NYC time
4. The original selection is preserved when switching between timezones

## Notification System

Firebase Cloud Messaging is used to send push notifications:

1. Users can request a notification before the store opens
2. Notifications are scheduled to arrive one hour before opening time
3. The system handles timezone differences when scheduling notifications

## Home Screen Features

The Home screen is the main interface of the app and includes several key components:

### Timezone Toggle
- Switch between NYC and local timezone
- All times automatically update when switching

### Greeting Card
- Shows personalized greeting based on user's name
- Displays current store status (open/closed)

### Date Selection
- Calendar interface for selecting dates
- Dates marked if store has special hours

### Time Slot Selection
- Available time slots shown with green indicators
- Unavailable time slots shown with red indicators
- Time slots adapt to timezone selection

### Store Status Card
- Shows if the store is open/closed at selected date/time
- Displays next opening time if store is closed

### Next Opening Card
- Only shown in local timezone view
- Shows when the store will next be open in user's time
- Includes "Notify Me" button for notifications

## Contact

For any questions or support, please contact [mustafachaiwala2003@gmail.com](mailto:mustafachaiwala2003@gmail.com)
