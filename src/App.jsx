import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Input, Button } from '@/components/ui'

async function getTemp({latitude: lat,longitude: long, country, name: city}) { // destructuring and renaming variables 
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`); // fetch being used to call server/ making API calls
  const temperatureObj = await response.json();
  const temp = temperatureObj.current.temperature_2m;
  const unit = temperatureObj.current_units.temperature_2m;
  return {temp, unit, city, country}

}

async function getCityCoordinates(city) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=3`);
  const coordinates = await response.json();
  return coordinates.results;
}

async function getCityWeather(city) {
  const cityResults = await getCityCoordinates(city);
  const tempPromiseArr = cityResults.map(getTemp)
  const tempArr = await Promise.all(tempPromiseArr); // waiting for all promises to be done
  return tempArr
}

function App() {
  const [city, setCity] = useState('')
  const [results, setResults] = useState([])
  console.log(city);

  const onFnKeyUp = (e) => {
    if (e.code === "Enter") {
      onBtnClick()
    }
  }
const onBtnClick = async () => {
    const result = await getCityWeather(city)
    setResults(result)
  }

  console.log(results);

  return (
    <div className='w-full h-full'>
      <Input onChange={e => setCity(e.target.value)} onKeyUp={onFnKeyUp}/>
      <Button onClick={onBtnClick}>Fetch</Button>
      <ul>{results.map(({temp, unit, city, country}) => {
        return(<li key={temp+unit+city+country}>{temp} {unit} - {city} {country}</li>)
      })}</ul>
    </div>
  )
}

export default App
