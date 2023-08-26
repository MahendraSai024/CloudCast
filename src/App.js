import React, { useState, useEffect } from "react"
import axios from "axios"
import 'moment-timezone';
import moment from "moment";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  // For passing on the location to the url 
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')

  // Faced difficult displaying the time -> 3Days time
  const [time, setTime] = useState('')

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=bdc11ef0669c0f0bd68cd93bc65913c0`

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data)
        setLocation('') // After hitting enter once need to change the input text
        getTime(response.data.timezone);
        successNotify();
      })
        .catch(function (error) {
          setData("");
          setLocation("");
          failedNotify();
        });
    }
  }

  function getTime(timeZone) {
    const targetTimeZoneOffset = timeZone; 
    const targetTime = moment().utcOffset(targetTimeZoneOffset / 60).format('MMM Do hh:mm:ss a');
    setTime(targetTime);
  }

  useEffect(() => {
    const timer = setInterval(()=>{
      setTime(prevTime => {
        const formattedTime = moment(prevTime, 'MMM Do hh:mm:ss a').add(1, 'seconds').format('MMM Do hh:mm:ss a');
        return formattedTime;
      });
    } , 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [time]);


  const failedNotify = () => toast.error("Sorry, No city found!!", { autoClose : 2000});
  const successNotify = () => toast.success("City found!!", { autoClose : 2000});


  return (
    <div className="app">
      <div className="search">
        <p><strong>Weather App</strong></p>
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <ToastContainer />
      {data.name !== undefined &&
        <div className="container">
          <div className="top">
            <div className="location">
              <p className="time">{time}</p>
              <p className="city">{data.name} , {data.sys.country}</p>
            </div>
            <div className="temp">
              <div>
                {/* Kelvin to C conversion, .toFixed() to round up the number i.e 32.66 to 33  */}
                <h1>{data.main.temp.toFixed()}°C</h1>
                {/* Displays if exist 1-> Check if main is available 2-> Yes, then proceed deep down to retrieve the temperature temp */}
              </div>
              <div>
                {/* Icon of the weather is provided by the openweather map website */}
                <img className="icon" src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="" />
                <p className="description" >{data.weather[0].main}</p>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="feels">
              <p className="bold">{data.main.feels_like.toFixed()}°C</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>

            </div>
            <div className="wind">
              <p className="bold">{data.wind.speed}MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      }


    </div>

  );
}

export default App;


/*  
-> Single Page Application
In the URL that connects the API with the frontend we are adding unit=metrics as a parameter
As by default kelvin would be fetched from the API. This unit is present in the OpenWeather Website 

More information: https://openweathermap.org/current
Time: https://www.npmjs.com/package/react-moment
Notifications: https://www.npmjs.com/package/react-toastify
*/