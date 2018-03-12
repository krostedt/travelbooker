import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarManager from './CalendarManager';
import { Route, Redirect } from 'react-router-dom';
import ROUTES from './routes';
import { auth, firebase, uiConfig, StyledFirebaseAuth } from './firebase-main';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signedIn: false };
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user && user !== 0) {
        this.props.signIn();
      }
    });
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <div>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
      );
    }
    return (
      <div>
        <p>Welcome ! You are now signed-in!</p>
        <LogoutButton />
      </div>
    );
  }
}

class LogoutButton extends React.Component {
  render() {
    console.log(this.props);
    return (
      <button type="button" onClick={this.props.handleLogout}>
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

const Calendar = props => {
  return (
    <div>
      <LogoutButton handleLogout={props.signOut} />
      <CalendarManager db={firebase} />
    </div>
  );
};

const Title = () => {
  return (
    <div>
      <h1>Travelbooker</h1>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { signedIn: false };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    console.log('logging user in');
    this.setState({ signedIn: true });
  }

  handleLogout() {
    console.log('logging user out');

    const app = this;

    auth
      .signOut()
      .then(function() {
        // success

        app.setState({ signedIn: false });
        console.log('logout success');
      })
      .catch(function(error) {
        // error
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Title />
        <Route exact path={ROUTES.root} component={LoginPage} />
        <Route
          path={ROUTES.login}
          render={() =>
            !this.state.signedIn ? (
              <LoginPage signIn={this.handleLogin} />
            ) : (
              <Redirect to={ROUTES.calendar} />
            )
          }
        />
        <Route
          path={ROUTES.calendar}
          render={() =>
            !this.state.signedIn ? (
              <Redirect to={ROUTES.login} />
            ) : (
              <Calendar signOut={this.handleLogout} />
            )
          }
        />
      </div>
    );
  }
}

export default App;
