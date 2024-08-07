import { DateTime } from "luxon";

const apiKey = '1fa9ff4126d95b8db54f3897a208e91c';
const baseURL = 'https://api.openweathermap.org/data/2.5/';

const getWeatherData = (infotype, searchParams) => {
    const url = new URL(baseURL + '/' + infotype);
    url.search = new URLSearchParams({ ...searchParams, appid: apiKey });
    return fetch(url)
        .then((res) => res.json());
};
const formatCurrentWeather = (data) => {
    const {
        coord : {lat, lon},
        main : {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys : {country, sunrise, sunset},
        weather,
        wind : {speed}
    } = data
    const {main:details, icon} = weather[0]
        return{lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, details, icon, speed};
}
const formatForecastWeather = (data) => {
    let {timezone, daily, hourly} = data;
    daily = daily.slice(1, 6).map((d) => {
        return {
            title : formatToLocalTime(d.dt, timezone, "ccc"),
            temp : d.temp.day,
            icon : d.weather[0].icon
        }
    });
    hourly = hourly.slice(1, 6).map((d) => {
        return {
            title : formatToLocalTime(d.dt, timezone, "hh:mm a"),
            temp : d.temp,
            icon : d.weather[0].icon
        }
    });
    return {timezone, daily, hourly}
}
const getFormatedWeatherData = async (searchParams) => {
    const formatedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather);

    const {lat, lon} = formatedCurrentWeather;

    const formatedForecastWeather = await getWeatherData('onecall', {
        lat, lon, exclude:'current, minutely, alerts', units: searchParams.units,
    }).then(formatForecastWeather)

    return {...formatedCurrentWeather, ...formatedForecastWeather};
}
const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`

export default getFormatedWeatherData
export {formatToLocalTime, iconUrlFromCode};