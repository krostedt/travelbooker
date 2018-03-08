import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseui from 'firebaseui';

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
  signInSuccessUrl: '/calendar',
  signInOptions: [
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  tosUrl: 'http://www.google.com',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccess: function() {
      console.log('test');
      return true;
    },
    signInFailure: function(error) {
      // Some unrecoverable error occurred during sign-in.
      // Return a promise when error handling is completed and FirebaseUI
      // will reset, clearing any UI. This commonly occurs for error code
      // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
      // occurs. Check below for more details on this.
      console.log('error');
    }
  }
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.database();

export { auth, db, firebase, uiConfig, StyledFirebaseAuth };
