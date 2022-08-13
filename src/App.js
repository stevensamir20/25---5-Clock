import './App.css';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [startAudio, setStartAudio] = useState(new Audio('https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'));

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + ":" +(seconds < 10 ? "0" + seconds : seconds)
      )
  }

  function Length({title, changeTime, type, time, formatTime}){
    return (
      <div className={type}>
        <h3 id={type+"-label"}>{title}</h3>
        <button 
        id={type+"-decrement"}
        className="btn btn-danger"
        onClick={() => changeTime(-60, type)}>-</button>
        <h3 id={type+"-length"}>{formatTime(time)}</h3>
        <button 
        id={type+"-increment"}
        className="btn btn-success"
        onClick={() => changeTime(+60, type)}>+</button>
      </div>
    )
  }

  const changeTime = (amount, type) => {
    if (type === "break"){
      if(breakTime <= 60 & amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount)
    }
    else {
      if(sessionTime <= 60 & amount < 0){
        return;
      }
      setSessionTime((prev) => prev + amount);
      if(!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVar = onBreak;
  if (!timerOn) {
    let interval = setInterval(() => {
      date = new Date().getTime();
      if (date > nextDate) {
        setDisplayTime(prev => {
          if (prev <= 0 && !onBreakVar){
            playSound();
            onBreakVar=true;
            setBreakTime(true)
            return breakTime;
          }
          else if (prev <= 0 && onBreakVar){
            playSound();
            onBreakVar=false;
            setBreakTime(false)
            return sessionTime;
          }
          return prev - 1;
        });
        nextDate += second;
      }
    }, 30)
    localStorage.clear();
    localStorage.setItem('interval-id', interval)
  }
  if (timerOn) {
    clearInterval(localStorage.getItem("interval-id"))
  }
  setTimerOn(!timerOn)
  }

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  }

  const playSound = () => {
    startAudio.currentTime = 0;
    startAudio.play();
  }

  return (
    <div className="App">
      <div className="container">
        <h1 id="name">25 + 5 Clock</h1>
        <Length 
        title={"Break Length"} 
        changeTime={changeTime}
        type={"break"} 
        time={breakTime}
        formatTime={formatTime}
        />
        <Length 
        title={"Session Length"} 
        changeTime={changeTime}
        type={"session"} 
        time={sessionTime}
        formatTime={formatTime}
        />
        <h1 id="time">{formatTime(displayTime)}</h1>
        <div className='buttons'>
        <button className='btn btn-warning but' onClick={controlTime}>
        {timerOn ? ( <span>Pause</span> ) : ( <span>Start</span>) }
        </button>
          <button 
          className='btn btn-info but'  
          onClick={resetTime}>
           Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
