import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import CalendarManager from './CalendarManager';

class App extends Component {
  constructor(props) {
    super(props);
    // Initialize Firebase

    let config = {
      apiKey: 'AIzaSyBul-6awofxDhfB_-xzojnLnaDv7dKFf7k',
      authDomain: 'travelbkr.firebaseapp.com',
      databaseURL: 'https://travelbkr.firebaseio.com',
      projectId: 'travelbkr',
      storageBucket: '',
      messagingSenderId: '424597927994'
    };
    firebase.initializeApp(config);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Title />
        <CalendarManager db={firebase} />
      </div>
    );
  }
}

const Title = () => {
  return <h1>Travelbooker</h1>;
};

export default App;
