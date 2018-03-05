import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarManager from './CalendarManager';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import ROUTES from './routes';
import { auth, firebase, uiConfig, StyledFirebaseAuth } from './firebase-main';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signedIn: false };
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      return this.setState({ signedIn: user !== 0 });
    });
  }

  render() {
    console.log('current state is :');
    console.log(this.state.signedIn);
    if (this.state.signedIn) {
      return <Redirect to={ROUTES.calendar} />;
    }

    return (
      <div>
        <h2>Login</h2>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
}

class LogoutButton extends React.Component {
  handleLogout() {
    auth
      .signOut()
      .then(function() {
        // success
        console.log('logout success');
      })
      .catch(function(error) {
        // error
        console.log(error);
      });
  }

  render() {
    return (
      <button type="button" onClick={this.handleLogout}>
        Logout
      </button>
    );
  }
}

/*
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
*/

const Calendar = () => {
  return (
    <div>
      <CalendarManager db={firebase} />
      <LogoutButton />
    </div>
  );
};

const Title = () => {
  return <h1>Travelbooker</h1>;
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Title />
        <Route exact path={ROUTES.root} component={LoginPage} />
        <Route path={ROUTES.calendar} component={Calendar} />
      </div>
    );
  }
}

export default App;
