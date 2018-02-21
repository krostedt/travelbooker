import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import classSet from 'react-classset';
import firebase from 'firebase';

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

/**
 * Base component for managing the app
 */
class CalendarManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDay: undefined,
      dayItems: [],
      daysConfirmed: false,
      user: firebase.auth().currentUser
    };

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref('users/' + user.uid)
          .set({
            email: user.email,
            lastLogin: new Date().toLocaleDateString()
          });

        this.setState({ user: user });

        // get dates for user
        let userDates = firebase
          .database()
          .ref('/dates/' + this.state.user.uid)
          .once('value')
          .then(dataSnapshot => {
            let userData = dataSnapshot.val();
            console.log(dataSnapshot.val());

            if (userData) {
              const { selectedDays } = userData[Object.keys(userData)[0]];
              console.log(selectedDays);
              //console.log( selectedDays.split(',') );
              this.setState({
                dayItems: selectedDays.map(day => new Date(day))
              });
            }
          });
      } else {
        let email = process.env.REACT_APP_DEV_TEST_USERNAME;
        let password = process.env.REACT_APP_DEV_TEST_PASSWORD;

        firebase
          .auth()
          .signInAndRetrieveDataWithEmailAndPassword(email, password)
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
      }
    });

    this.handleClick = this.handleClick.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(event, day) {
    if (this.state.daysConfirmed) {
      return;
    }

    let dayIndex = this.state.dayItems.findIndex(element => {
      return element.getTime() === day.getTime();
    });

    this.setState(prevState => ({
      dayItems: prevState.dayItems.filter(
        (item, itemIndex) => itemIndex !== dayIndex
      )
    }));
  }

  handleConfirm() {
    if (this.state.dayItems.length <= 0) {
      console.log('select at least one item');
      return;
    }

    this.setState({ daysConfirmed: !this.state.daysConfirmed });

    if (this.state.user) {
      let connection = firebase.database().ref('dates/' + this.state.user.uid);

      let dayRef = connection.update({
        submitDate: new Date().toLocaleDateString(),
        selectedDays: this.state.dayItems.map(date => {
          return date.getTime();
        })
      });

      console.log(dayRef);
    }
  }

  handleClick(day, { currentSelected }) {
    // if days are confirmed, do not process additional clicks
    if (this.state.daysConfirmed) {
      return;
    }

    // ignore past dates
    if (day.getTime() < new Date().getTime()) {
      return;
    }

    // check if the date exists in array of day items
    let inSelected = this.state.dayItems.findIndex(element => {
      return element.getTime() === day.getTime();
    });

    if (currentSelected) {
      this.setState({ activeDay: undefined });
    }

    // if not found, add to array of day items
    if (inSelected === -1) {
      this.setState({
        activeDay: day,
        dayItems: [...this.state.dayItems, day]
      });

      return;
    }

    // if found, remove from day item array
    this.setState({
      dayItems: this.state.dayItems.filter(
        (item, itemIndex) => itemIndex !== inSelected
      )
    });
  }

  render() {
    let mainClasses = classSet({
      calendarContainer: true,
      daysConfirmed: this.state.daysConfirmed
    });
    let disabledDays = {
      before: new Date()
    };
    return (
      <div className={mainClasses}>
        Calendar
        <DayPicker
          localeUtils={MomentLocaleUtils}
          locale={'fi'}
          onDayClick={this.handleClick}
          selectedDays={this.state.dayItems}
          disabledDays={disabledDays}
        />
        {this.state.dayItems.length <= 0 && <p>Please select a day</p>}
        {this.state.selectedDays && (
          <p>You clicked {this.state.activeDay.toLocaleDateString()}</p>
        )}
        <DayList
          dayList={this.state.dayItems}
          remove={this.handleRemove}
          confirmed={this.state.daysConfirmed}
        />
        <ConfirmButton
          onConfirm={this.handleConfirm}
          confirmed={this.state.daysConfirmed}
        />
      </div>
    );
  }
}

/**
 * individual components
 */

function DayList(props) {
  const dayList = props.dayList;
  const dayItems = dayList.map((day, index) => (
    <DayItem
      key={index}
      date={day}
      remove={props.remove}
      confirmed={props.confirmed}
    />
  ));
  // {dayItems.map( day => <DayItem key={day} />)}
  return (
    <div className="DayItems">
      {dayItems.length ? (
        <p> {props.confirmed ? 'Confirmed' : 'Selected'} days</p>
      ) : (
        ''
      )}
      {dayItems}
    </div>
  );
}

const Title = () => {
  return <h1>Title</h1>;
};

const DayItem = props => {
  return (
    <p>
      {props.date.toLocaleDateString()}
      {props.confirmed ? (
        ''
      ) : (
        <span
          className="remove"
          onClick={evt => {
            props.remove(evt, props.date);
          }}
        >
          [x]
        </span>
      )}
    </p>
  );
};

const ConfirmButton = props => {
  return (
    <button type="button" onClick={props.onConfirm}>
      {props.confirmed ? 'Confirmed' : 'Confirm'}
    </button>
  );
};

export default App;
