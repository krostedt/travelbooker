import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

/*const auth = {
    isAuthenticated: false,
    login(cb) {
      this.isAuthenticated = true;
      //console.log("login");
      cb();
    },
    logout(cb) {
      this.isAuthenticated = false;
      cb();
    }
  };*/

const config = {
  apiKey: 'AIzaSyBul-6awofxDhfB_-xzojnLnaDv7dKFf7k',
  authDomain: 'travelbkr.firebaseapp.com',
  databaseURL: 'https://travelbkr.firebaseio.com',
  projectId: 'travelbkr',
  storageBucket: '',
  messagingSenderId: '424597927994'
};

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  //signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccess: () => false
  }
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.database();

export { auth, db, firebase, uiConfig, StyledFirebaseAuth };
