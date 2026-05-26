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

## Protected Firestore rules

Use these rules after enabling Firebase Authentication with Google sign-in:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menus/current {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == "danybhati2001@gmail.com";
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Required Authentication setup

1. Firebase Console > Authentication > Get started.
2. Sign-in method > Google > Enable.
3. Authentication > Settings > Authorized domains.
4. Add `sfc-star.github.io` if it is not already listed.

After this, customers can read the menu, but only `danybhati2001@gmail.com` can update it from the admin panel.
