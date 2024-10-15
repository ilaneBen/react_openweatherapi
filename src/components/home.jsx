import React, { Component } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'; // Importer les composants Swiper
import '../assets/css/home.css'; // Ton fichier de style personnalisé

const API_KEY = "f829cab68807f74cd6f30ecf447646e0";

class Home extends Component {
  // Initialisation de l'état
  state = {
    forecastData: null, // Données de prévision météo par défaut null
  };

  componentDidMount() {
    this.fetchForecastData();
  }

  // Fonction pour récupérer les prévisions météo sur 5 jours
  fetchForecastData = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Paris,fr&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          forecastData: data, // Mettre à jour l'état avec les données de prévision
        });
      })
      .catch((error) => console.log("Erreur lors de la récupération des données météo", error));
  };

  render() {
    const { forecastData } = this.state;

    return (
      <div>
        {/* Si les données de prévision sont disponibles, on les affiche dans Swiper */}
        {forecastData ? (
          <div className="forecast">
            <h1>Prévisions météo pour {forecastData.city.name}</h1>
            <Swiper
              spaceBetween={50}
              slidesPerView={3} // Afficher 3 prévisions par vue (tu peux ajuster)
              pagination={{ clickable: true }} // Pagination cliquable
            >
              {forecastData.list.map((forecast, index) => (
                <SwiperSlide key={index}> {/* Chaque élément est un slide */}
                  <div className="forecast-item">
                    <p><strong>Date et heure :</strong> {forecast.dt_txt}</p>
                    <p><strong>Température :</strong> {forecast.main.temp} °C</p>
                    <p><strong>Humidité :</strong> {forecast.main.humidity} %</p>
                    <p><strong>Conditions :</strong> {forecast.weather[0].description}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      alt="Weather Icon"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p>Chargement des prévisions météo...</p>
        )}
      </div>
    );
  }
}

export default Home;
