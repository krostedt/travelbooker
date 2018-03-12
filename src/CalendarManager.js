import React from 'react';
import classSet from 'react-classset';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';
import { auth, firebase } from './firebase-main';

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

    this.authUser().then(
      user => {
        this.setUserData(user);
      },
      error => {
        console.log('fail');
      }
    );

    this.handleClick = this.handleClick.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.setUserData = this.setUserData.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.authUser = this.authUser.bind(this);
  }

  authUser() {
    return new Promise(function(resolve, reject) {
      firebase.auth().onAuthStateChanged(user => {
        console.log('auth state changed');
        if (user) {
          resolve(user);
        } else {
          reject('user not logged in');
          console.log('no user');
        }
      });
    });
  }

  loginUser() {
    let email = process.env.REACT_APP_DEV_TEST_USERNAME;
    let password = process.env.REACT_APP_DEV_TEST_PASSWORD;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('done');
        //this.setState(() => ({ ...INITIAL_STATE }));
        //history.push(routes.HOME);
      })
      .catch(error => {
        // Handle Errors here.
        //this.setState(byPropKey('error', error));
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

  setUserData(user) {
    console.log('current user:');
    console.log(auth.currentUser.email);

    // set user last login
    firebase
      .database()
      .ref('users/' + user.uid)
      .set({
        email: user.email,
        lastLogin: new Date().toLocaleDateString()
      });

    this.setState({
      user: user,
      signedIn: user !== 0
    });

    // get dates for user
    firebase
      .database()
      .ref('/dates/' + this.state.user.uid)
      .once('value')
      .then(dataSnapshot => {
        let userData = dataSnapshot.val();
        console.log(dataSnapshot.val());

        if (userData) {
          this.setState({
            dayItems: userData.selectedDays.map(day => new Date(day))
          });
        }
      });
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

  // handle calendar click
  handleClick(day, { currentSelected }) {
    // if day is not valid or input not allowed, exit
    if (this.state.daysConfirmed || day.getTime() < new Date().getTime()) {
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
        <p>Hello {auth.currentUser && auth.currentUser.email}</p>
        <h3>Calendar</h3>
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
        <h4 className="dayListTitle">
          {' '}
          {props.confirmed ? 'Confirmed' : 'Selected'} days
        </h4>
      ) : (
        ''
      )}
      {dayItems}
    </div>
  );
}

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

export default CalendarManager;
