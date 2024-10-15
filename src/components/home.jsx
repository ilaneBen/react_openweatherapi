import React, { Component } from "react";
import '../assets/css/home.css'; 

const API_KEY = "f829cab68807f74cd6f30ecf447646e0";

class Home extends Component {
  // Initialisation de l'état
  state = {
    weatherData: null, // Données météo par défaut null
  };

  componentDidMount() {
    this.fetchWeatherData();
  }

  fetchWeatherData = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          weatherData: data, // Mettre à jour l'état avec les données météo
        });
      })
      .catch((error) => console.log("Erreur lors de la récupération des données météo", error));
  };

  render() {
    const { weatherData } = this.state;

    return (
      <div>
        {/* Si les données météo sont disponibles, on les affiche */}
        {weatherData ? (
          <div className="weather">
            <h1>Météo à {weatherData.name}</h1>
            <p>Température : {weatherData.main.temp} °C</p>
            {/* <p>Longitude : {weatherData.coord.lon} '</p>
            <p>latitude : {weatherData.coord.lat} '</p> */}
            <p>Humidité : {weatherData.main.humidity} %</p>
          </div>
        ) : (
          <p>Chargement des données météo...</p>
        )}
      </div>
    );
  }
}

export default Home;
