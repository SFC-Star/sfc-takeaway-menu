# SFC Shared Menu Setup

This app can publish admin menu edits to every QR user through Firebase Firestore.

## One-time Firebase steps

1. Create a free Firebase project.
2. Add a Web app in Firebase settings.
3. Copy the Firebase config values into `firebase-config.js`.
4. Create a Firestore database.
5. Create this document once:
   - Collection: `menus`
   - Document: `current`
   - Fields:
     - `items`: array
     - `categoryDiscounts`: map

## Basic Firestore rules

For easiest testing:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menus/current {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

These rules make menu editing work from the admin panel, but anyone technical could write to the menu if they inspect the site. For stronger security, use Firebase Auth for the admin account and change write rules to admin-only.
