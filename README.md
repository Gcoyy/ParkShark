# ParkShark

ParkShark is a mobile parking violation reporting app built with React Native and Expo. It supports two user roles:

- User: capture a parking violation photo, add details, pin a location, and submit a report.
- Enforcer: view all unresolved reports on a map, review report details, and update incident status.

The app is designed for a city parking enforcement workflow where civilians report violations and enforcement staff monitor and resolve them.

## Features

### User side
- Sign up and log in
- View and edit profile information
- Capture photo evidence from the device camera
- Add plate number, description, and location to a report
- Pin report location on a map
- View submitted reports and their details
- Receive confirmation after successful submission

### Enforcer side
- Log in as a traffic enforcer
- View all unresolved reports on a map
- Review report information and images
- Update report status
- View parking-pattern data and historical report trends

## Tech stack

- React Native
- Expo SDK 52
- Expo Router
- Supabase for authentication and data storage
- AsyncStorage for local session persistence
- Expo Camera, Expo Location, React Native Maps
- File uploads to Supabase Storage

## Project structure

```text
ParkShark2.0/
├── app/
│   ├── _layout.jsx
│   ├── LoginScreen.jsx
│   ├── SignUpScreen.jsx
│   ├── User/
│   │   ├── CameraScreen.jsx
│   │   ├── DetailedReportScreen.jsx
│   │   ├── EditProfileScreen.jsx
│   │   ├── InputReportDetailsScreen.jsx
│   │   ├── Location.jsx
│   │   ├── PinLocation.jsx
│   │   ├── SavedMessageScreen.jsx
│   │   ├── SubmissionMessageScreen.jsx
│   │   ├── UserHomeScreen.jsx
│   │   ├── ViewMyReportsScreen.jsx
│   │   └── ViewProfileScreen.jsx
│   └── Enforcer/
│       ├── EnforcerHomeScreen.jsx
│       ├── Map.jsx
│       ├── UpdateStatus.jsx
│       ├── ViewAllReports.jsx
│       └── ViewParkingPatterns.jsx
├── assets/
├── app.json
├── eas.json
├── package.json
├── supabase.js
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- npm or Yarn
- Expo CLI
- An Android emulator, iOS simulator, or a physical device with Expo Go
- A Supabase project with the required tables and storage buckets
- A Google Maps API key for Android if you plan to use the map provider in production

## Installation

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

```bash
npm install
```

## Configuration

### 1. Supabase setup

The app connects to Supabase through the file `supabase.js`.

Update the file with your Supabase project URL and anon key:

```js
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

The app expects these Supabase objects and storage buckets to exist:

#### Tables
- `UserProfile`
  - `User_ID`
  - `Username`
  - `Password`
  - other profile fields as needed
- `Traffic Enforcer`
  - `Name`
  - `Password`
- `Report`
  - `Report_ID`
  - `Picture`
  - `PlateNo`
  - `Details`
  - `Latitude`
  - `Longitude`
  - `Status`
  - `TimeStamp`
  - `User_ID`

#### Storage buckets
- `user-photos`
- `enforcer-photos`
- `report-pictures`

### 2. Mobile app config

The app configuration is defined in `app.json`.

If you are using Google Maps in Android, update the Android config in `app.json` with your valid Google Maps API key:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

## Running the app

Start the Expo development server:

```bash
npm start
```

Then choose one of the following:

```bash
npm run android
npm run ios
npm run web
```

## Usage

### User workflow
1. Open the app and choose Log In or Sign Up.
2. Create an account or log in with your username and password.
3. From the user home screen, choose Make a Report.
4. Take a photo, fill in the license plate and report details, and pin the location.
5. Submit the report.
6. View submitted reports from the dashboard.

### Enforcer workflow
1. Log in using the enforcer account.
2. Open View All Reports to see all active reports on a map.
3. Tap a report to review details and update the report status.
4. Use the parking patterns view to inspect report trends.

## Notes

- The app stores local session information with `AsyncStorage`.
- Report images are uploaded to Supabase storage and linked to entries in the `Report` table.
- This project is currently structured around a specific Supabase schema and may require database/table adjustments depending on your environment.
- Sensitive credentials should never be committed directly to source control. Keep them in environment/config files or your secure Supabase project settings.

## Common issues

- `User not found` or `Incorrect password` during login usually means the username and password in Supabase do not match the expected values in `UserProfile` or `Traffic Enforcer`.
- Missing map data or blank map screens often mean the Google Maps API key or location permissions are not configured correctly.
- Failed image uploads usually come from a missing Supabase Storage bucket or invalid bucket permissions.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.
