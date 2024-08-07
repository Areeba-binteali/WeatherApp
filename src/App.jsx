import UilReact from '@iconscout/react-unicons/icons/uil-react'
import './App.css'
import TopButtons from './components/topButtons'
import Inputs from './components/inputs'
import TimeAndLocation from './components/timeAndLocation'
import TempratureAndDetails from './components/tempratureAndDetails'
import Forecast from './components/forecast'
import getFormatedWeatherData from './services/weatherService'
import { useEffect, useState } from 'react'

function App() {

  const [query, setQuery] = useState({ q: 'Berlin' })
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormatedWeatherData({ ...query, units }).then((data) => {
        setWeather(data);
      });
    }
    fetchWeather();
  }, [query, units])

  return (
    <div className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400">
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
      {weather && (
        <>
          <TimeAndLocation weather={weather}/>
          <TempratureAndDetails weather={weather}/>
          <Forecast title="hourly forecast" items={weather.hourly}/>
          <Forecast title="daily forecast" items={weather.daily}  />
        </>
      )}
    </div>
  )
}

export default App
