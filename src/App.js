import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import CalendarManager from './CalendarManager';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import ROUTES from './routes';

const auth = {
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
};

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = {
      redirectToCalendar: false,
      isAuthenticated: false
    };
  }

  handleLogin = () => {
    auth.login(() => {
      this.setState({ redirectToCalendar: true });
    });
  };

  render() {
    if (this.state.redirectToCalendar) {
      return (
        <Redirect
          to={{
            pathname: ROUTES.calendar,
            state: { isAuthenticated: this.state.isAuthenticated }
          }}
        />
      );
    }

    return (
      <div>
        <h2>Login</h2>
        <button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}

const Calendar = () =>
  !auth.isAuthenticated ? (
    <Redirect
      to={{
        pathname: ROUTES.root,
        state: { isAuthenticated: auth.isAuthenticated }
      }}
    />
  ) : (
    <CalendarManager db={firebase} />
  );

const Title = () => {
  return <h1>Travelbooker</h1>;
};

class App extends Component {
  constructor(props) {
    super(props);
    // Initialize Firebase

    const config = {
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
        <Route exact path={ROUTES.root} component={Login} />
        <Route path={ROUTES.calendar} render={Calendar} />
      </div>
    );
  }
}

export default App;
