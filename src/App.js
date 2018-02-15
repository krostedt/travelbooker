import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/fi';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Title />
        <CalendarManager />
      </div>
    );
  }

}

class CalendarManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeDay: undefined,
      dayItems: [],
      daysConfirmed: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);

  }

  handleConfirm() {
    this.setState({daysConfirmed: true});
  }

  handleClick(day, {currentSelected} ) {
    
    console.log("date clicked: " + day);

    let existsIn = this.state.dayItems.findIndex( element => {
      return element.getTime() === day.getTime();
    });
    
    if (currentSelected) {

      this.setState({activeDay: undefined});

      // skip testing if index is valid since item has been selected before
      this.setState({  
          dayItems: this.state.dayItems.filter( (item, itemIndex) => itemIndex !== existsIn )
      });      

      return;
    }

    if (existsIn === -1) {

      this.setState({
        activeDay: day,
        dayItems: [...this.state.dayItems, day]
      });

    } else {

      // skip testing if index is valid since item has been selected before
      this.setState({  
        dayItems: this.state.dayItems.filter( (item, itemIndex) => itemIndex !== existsIn )
      });  

    }

    


    
  }

  render() {

    return (
      <div className="calendarContainer">
        Calendar 
        <DayPicker 
          localeUtils={MomentLocaleUtils}
          locale={'fi'}
          onDayClick={this.handleClick} 
          selectedDays={this.state.activeDay}
        />
        {this.state.activeDay ? (<p>You clicked {this.state.activeDay.toLocaleDateString()}</p>) : (<p>Please select a day</p>)}
        <DayList 
          dayList={this.state.dayItems} 
        />
        <ConfirmButton onConfirm={this.handleConfirm} confirmed={this.state.daysConfirmed} />
      </div>
    );
  }
}

function DayList(props) {
  const dayList = props.dayList;
  const dayItems = dayList.map( (day, index) => 
    <DayItem key={index} date={day} /> 
  );
 // {dayItems.map( day => <DayItem key={day} />)}
  return (
    <div>
      {dayItems.length ? (<p>Selected days</p>) : ('')}
      {dayItems}
    </div>
  );
}

const Title = () => {
  return (<h1>Title</h1>);
};

const DayItem = (props) => {
  return (<p>{props.date.toLocaleDateString()}</p>);
};

const ConfirmButton = (props) => {
  console.log(props);
  return (<button type="button" onClick={props.onConfirm}>{props.confirmed ? ("Confirmed") : ("Confirm")}</button>);
};

export default App;
