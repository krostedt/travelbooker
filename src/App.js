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
  handleLogout() {
    auth
      .signOut()
      .then(function() {
        // success
        console.log('logout success');
        return <Redirect to={ROUTES.login} />;
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
      <LogoutButton />
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
  }

  handleLogin() {
    console.log('logging user in');
    this.setState({ signedIn: true });
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
            !this.state.signedIn ? <Redirect to={ROUTES.login} /> : <Calendar />
          }
        />
      </div>
    );
  }
}

export default App;
