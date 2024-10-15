import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/home.css'; // Ton fichier de style
import { Audio, Circles } from 'react-loader-spinner'
;
const API_KEY = "f829cab68807f74cd6f30ecf447646e0";

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);

  // Utilisation de useGeolocated pour obtenir la géolocalisation de l'utilisateur
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  // Fonction pour récupérer les données météo (prévisions sur 5 jours avec des intervalles de 3 heures)
  const fetchWeatherData = (latitude, longitude) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données météo", error);
      });
  };

  // Utiliser les coordonnées une fois qu'elles sont disponibles pour récupérer les données météo
  useEffect(() => {
    if (coords) {
      fetchWeatherData(coords.latitude, coords.longitude);
    }
  }, [coords]);

  if (!isGeolocationAvailable) {
    return <div>Votre navigateur ne supporte pas la géolocalisation.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>La géolocalisation est désactivée. Veuillez l'activer.</div>;
  }

  if (!coords) {
    return         <div className="loader">
    <Circles
 height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
    />  
    </div>  
  }

  return (
    <div>
      {weatherData ? (
        <div className="forecast">
          <h1>Prévisions météo pour {weatherData.city.name}</h1>
          <Swiper
            spaceBetween={50}
            slidesPerView={3} // Afficher 3 prévisions par vue (ajuster selon les besoins)
            pagination={{ clickable: true }} // Pagination cliquable
          >
            {weatherData.list.map((forecast, index) => (
              <SwiperSlide key={index}>
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
        <div className="loader">
<Circles
 height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>  
</div>  
  )}
    </div>
  );
};

export default Home;
