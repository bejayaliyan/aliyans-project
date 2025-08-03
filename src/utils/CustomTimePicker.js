import React, { Component, useRef, Fragment } from "react";
import './time_picker.scss';
import { nice } from "d3";
class CustomTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            containerStatus : false,
            timePeriodStatus: true, // True for AM, False for PM.
            hours: 12,
            mins: 0,
            time: "",
        };
    }
    isValidTime = (timeString) => {
        // Regular expression to validate the time format
        const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/;
      
        if (timeRegex.test(timeString)) {
          // Extract hours, minutes, and period (AM/PM)
          const [, hours, minutes, period] = timeString.match(timeRegex);
      
          // Validate hours
          const validHours = parseInt(hours, 10) >= 1 && parseInt(hours, 10) <= 12;
      
          // Validate minutes
          const validMinutes = parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59;
      
         if(validHours && validMinutes) {
            this.setState({hours: hours, mins: minutes});
            if(period == "AM") {
                this.setState({timePeriodStatus:true});
            } else {
                this.setState({timePeriodStatus:false});
            }
            return true;
         } else {
            return false;
         }
        }
      
        return false;
      }

    formatNumber = (number) => {
        return number.toString().padStart(2, '0');
    }

    setUpdatedTime = () => {
        setTimeout(() => {
            const timeperiod = this.state.timePeriodStatus? 'AM':'PM';
            let updatedtime =  `${this.formatNumber(this.state.hours) + ':' + this.formatNumber(this. state.mins) + ' '+ timeperiod}`;
            this.setState({time:updatedtime});
            this.props.updatedTime(updatedtime);
        },20);
       
    }
    showContainer = () => {
        if(this.state.time == "") {
        this.setUpdatedTime();
        }
        this.setState({containerStatus:true});
    }
    changeTimePeriodStatus = (value) => {
        this.setState({timePeriodStatus:value});
        this.setUpdatedTime();
    }
    hoursChange = (e) => {
        if(e.target.value <= 12) {
            if(e.target.value == 0 || e.target.value < 0) {
                this.setState({hours: 12});
                this.setState({timePeriodStatus: !this.state.timePeriodStatus});
            } else {
                this.setState({hours: e.target.value});
            }
        } else if(e.target.value > 12) {
            this.setState({hours: 1});
            this.setState({timePeriodStatus: !this.state.timePeriodStatus});
        }
        this.setUpdatedTime();
    }
    minsChange = (e) => {
        if(e.target.value <= 59) {
            if(e.target.value == 0 || e.target.value < 0) {
                this.setState({mins: 60});
            } else {
                this.setState({mins: e.target.value});
            }
        } else if (e.target.value == 60) {
            this.setState({mins: 0});
            const hours = Number.parseInt(this.state.hours);
            if(hours == 12) {
                this.setState({hours: 1});
            } else if(hours < 12) {
                this.setState({hours: hours + 1});
            }
        } else if(e.target.value > 60)  {
            this.setState({mins: 0});
        }  
        this.setUpdatedTime();
    }
    hoursUp = () => {
        const hours = this.state.hours + 1;
        if(hours <= 12) {
            if(hours == 0 || hours < 0) {
                this.setState({hours: 12});
            } else {
                this.setState({hours: hours});
            }
        } else if(hours > 12) {
            this.setState({hours: 1});
            this.setState({timePeriodStatus: !this.state.timePeriodStatus});
        }
        this.setUpdatedTime();
    }
    hoursDown = () => {
        const hours = this.state.hours - 1;
        if(hours <= 12) {
            if(hours == 0 || hours < 0) {
                this.setState({hours: 12});
                this.setState({timePeriodStatus: !this.state.timePeriodStatus});
            } else {
                this.setState({hours: hours});
            }
        } else if(hours > 12) {
            this.setState({hours: 1});
        }
        this.setUpdatedTime();
    }
    minsUp = () => {
        const mins = this.state.mins + 1;
        if(mins <= 59) {
            if(mins == 0 || mins < 0) {
                this.setState({mins: 60});
            } else {
                this.setState({mins: mins});
            }
        } else if (mins == 60) {
            this.setState({mins: 0});
            const hours = Number.parseInt(this.state.hours);
            if(hours == 12) {
                this.setState({hours: 1});
                this.setState({timePeriodStatus: !this.state.timePeriodStatus});
            } else if(hours < 12) {
                this.setState({hours: hours + 1});
            }
        } else if(mins > 60)  {
            this.setState({mins: 0});
        } 
        this.setUpdatedTime();
    }
    componentDidMount() {
        const instance = this;
        document.body.addEventListener('click', function(e){
        if(!e.target.closest(".time-picker-container")) {
            let timePicker =   document.querySelector('.time-picker-inner-container');
              if(timePicker) {
                  if(timePicker.classList.contains("show")) {
                    instance.setState({containerStatus:false});
                  }
              }
        }
        })
    }
    minsDown = () => {
        const mins = this.state.mins - 1;
        if(mins <= 59) {
            if(mins == 0 || mins < 0) {
                this.setState({mins: 60});
            } else {
                this.setState({mins: mins});
            }
        } else if (mins == 60) {
            this.setState({mins: 0});
            const hours = Number.parseInt(this.state.hours);
            if(hours == 12) {
                this.setState({hours: 1});
                this.setState({timePeriodStatus: !this.state.timePeriodStatus});
            } else if(hours < 12) {
                this.setState({hours: hours + 1});
            }
        } else if(mins > 60)  {
            this.setState({mins: 0});
        }
        this.setUpdatedTime();
    }
    changeTime = (value) => {
        this.setState({ time: value });
    }
    validateTime = (value) => {
        if(!this.isValidTime(value)) {
            this.setUpdatedTime(); 
        }
    }

    render() {
        return (
            <div className="time-picker-container">

                <input
                    onClick={this.showContainer}
                    onChange={(e) => this.changeTime(e.target.value)}
                    onBlur={(e) => this.validateTime(e.target.value)}
                    value={this.state.time}
                    className="time-picker-input"
                    placeholder="Select Time"
                    type="text"
                    />
                <img
                        onClick={this.showContainer}
                        id="clock-image"
                        src="/images/mark/newclock.png"
                        width="20px"
                        height="20px"
                    />
                <div className={`${this.state.containerStatus ? 'show' : 'hide'} time-picker-inner-container`}>
                    <div className="hours-container">
                        <img
                            onClick={this.hoursUp}
                            className="arrow-up"
                            src="/images/mark/arrow_up.svg"
                            width="20px"
                            height="20px"
                        />
                        <input value={this.state.hours} onChange={(e) => this.hoursChange(e)} className="hours-input" type="number" />
                        <img
                            onClick={this.hoursDown}
                            className="arrow-down"
                            src="/images/mark/arrow_down.svg"
                            width="20px"
                            height="20px"
                        />
                    </div>
                    <span>:</span>
                    <div className="mins-container">
                        <img
                            onClick={this.minsUp}
                            className="arrow-up"
                            src="/images/mark/arrow_up.svg"
                            width="20px"
                            height="20px"
                        />
                        <input value={this.state.mins} onChange={(e) => this.minsChange(e)} className="mins-input" type="number" />
                        <img
                            onClick={this.minsDown}
                            className="arrow-down"
                            src="/images/mark/arrow_down.svg"
                            width="20px"
                            height="20px"
                        />
                    </div>
                    <div className="am-pm">
                     <span onClick={ () => this.changeTimePeriodStatus(true)} className={this.state.timePeriodStatus?'checked':''}>AM</span>
                     <span onClick={ () => this.changeTimePeriodStatus(false)} className={this.state.timePeriodStatus?'':'checked'}>PM</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomTimePicker;