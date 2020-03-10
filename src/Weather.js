import React from 'react';
import './App.css';
import keys from  './ApiKeys.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
var moment = require('moment');

const CustomizedDot = (props) => {
  const {
    cx, cy
  } = props;
  return (
    <svg x={cx-1} y={cy-1} width={40} height={40} fill="#f13c20" viewBox="0 0 1024 1024">
      <circle cx={15} cy={15} r={70} />
    </svg>
  );
};

const CurrentInfo = (props) =>{
  return(
    <div className="justify-content-center">
      <h5>{props.city} </h5>
      <h6>{props.weather}</h6>
      <h5>{props.temp} </h5>
    </div>
  )
}

class Weather extends React.Component {
  
    state = {
      curr_temp:0,
      curr_city: "",
      curr_weather:"",
      temp_time_data:[],
      weatherData:[]
    };

  componentDidMount = () => {
    const handler = e => this.setState({matches: e.matches});
    window.matchMedia("(min-width: 768px)").addListener(handler);
     const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?zip=20901,us&units=metric&APPID=${keys.weatherKey}`
    const weatherURL =
    `https://api.openweathermap.org/data/2.5/weather?zip=20901,us&units=metric&APPID=${keys.weatherKey}`

    fetch(weatherURL)
      .then(response => response.json())
      .then(data => {
        const curr_temp = Math.round(data.main["temp"])
        const curr_city = data.name
        const curr_weather = data.weather[0].description
        
        console.log("current" , data.weather[0].description)
      this.setState({
        curr_city:curr_city,
        curr_temp:curr_temp,
        curr_weather:curr_weather
      })})

    fetch(forecastURL)
    .then(res => res.json())
    .then(data => {
    const timeArr = data.list.map(item => item['dt_txt'])
    const tempArr = data.list.map(item => item['main'])
    const weatherArr = data.list.map(item => item['weather']).map(desc=>(desc[0])).map(des=>(des['description']))
    const feelsArr = tempArr.map(temp=>Math.round(temp['feels_like']))
    const temp = tempArr.map(temp=>Math.round(temp['temp']))
    const temp_time_data= [];
    console.log("weather data",weatherArr)
    for(var i=0;i<40;i++){
      temp_time_data.push([timeArr[i],temp[i],feelsArr[i]])
    }
    this.setState({
      temp_time_data: temp_time_data
    })
    })
  }

  render (){
    
    var tempData=this.state.temp_time_data;
    var currentTemp = this.state.curr_temp;
    var currentCity = this.state.curr_city;
    var currentWeather = this.state.curr_weather;
    console.log("state data",tempData)
    return(
    <div className="weatherApp box">
      <div className="currentWeather">
          <CurrentInfo temp = {currentTemp} city ={currentCity} weather={currentWeather} />
      </div>
      <ResponsiveContainer>
        <ComposedChart data={tempData}>
          <Bar name = "Temperature" dataKey="1" fill="#4056a1" barSize={2}/>
          <Line name = "Feels like" type= "natural" dataKey="2" stroke="#f13c20" dot={<CustomizedDot/>} />
          <XAxis dataKey="0" height={150} interval="preserveStart"/>
          <Tooltip cursor={{ stroke: 'white', strokeWidth: 2 }}/>
          <Legend verticalAlign="top" height={20} iconSize={10}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
    );
  }
}

function App(){
  return(
    <div className="app summerApp">
      <Weather/>
    </div>
  )
}

export default App;
