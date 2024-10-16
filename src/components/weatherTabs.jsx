import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap'; // Utilisation d'onglets de React-Bootstrap
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const WeatherTabs = ({ currentWeatherData, citiesWeatherData, userLocationData, weatherDataList }) => {
  const [activeTab, setActiveTab] = useState('current-location'); // Onglet actif

  const handleTabChange = (key) => {
    setActiveTab(key); // Changer l'onglet actif
  };

  // Fonction pour regrouper les prévisions météo par jour
  const groupForecastByDay = (forecastList) => {
    return forecastList.reduce((grouped, forecast) => {
      const date = new Date(forecast.dt_txt);
  
      // Formater la date en "mar 16 Septembre 2024"
      const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'short',   // Jour de la semaine en abrégé (ex : mar)
        day: 'numeric',     // Jour (ex : 16)
        month: 'long',      // Mois complet (ex : Septembre)
        year: 'numeric'     // Année (ex : 2024)
      });
  
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }
      grouped[formattedDate].push(forecast);
      return grouped;
    }, {});
  };
  

  // Trouver les prévisions pour l'onglet sélectionné (si une ville est sélectionnée)
  const selectedCityData = weatherDataList.find(item => item.city === activeTab);

  // Si des prévisions existent, regrouper les prévisions par jour
  const forecastsByDay = (activeTab === 'current-location' && userLocationData && userLocationData.list)
    ? groupForecastByDay(userLocationData.list)
    : selectedCityData && selectedCityData.data.list
      ? groupForecastByDay(selectedCityData.data.list)
      : {};

  return (
    <div className="forecast">
      {/* Onglets pour la localisation actuelle et les villes ajoutées */}
      <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
        {/* Onglet pour la localisation actuelle */}
        {userLocationData && (
          <Tab eventKey="current-location" title="Ma position">
            {currentWeatherData && currentWeatherData.main && currentWeatherData.weather && (
              <div className="current-weather">
                <h2>Météo actuelle à {currentWeatherData.name}</h2>
                <p>Température : {currentWeatherData.main.temp}°C</p>
                <p>Conditions : {currentWeatherData.weather[0].description}</p>
                <p>Humidité : {currentWeatherData.main.humidity}%</p>
              </div>
            )}
          </Tab>
        )}

        {/* Onglets pour les villes ajoutées */}
        {citiesWeatherData && citiesWeatherData.length > 0 && citiesWeatherData.map((citiesWeatherData, index) => (
          <Tab eventKey={citiesWeatherData.city} title={citiesWeatherData.city} key={index}>
            {citiesWeatherData.data && citiesWeatherData.data.main && citiesWeatherData.data.weather && (
              <div className="current-weather">
                <h2>Météo actuelle à {citiesWeatherData.city}</h2>
                <p>Température : {citiesWeatherData.data.main.temp}°C</p>
                <p>Conditions : {citiesWeatherData.data.weather[0].description}</p>
                <p>Humidité : {citiesWeatherData.data.main.humidity}%</p>
              </div>
            )}
          </Tab>
        ))}
      </Tabs>

      {/* Prévisions météo avec Swiper pour chaque jour */}
      {Object.keys(forecastsByDay).map((day, index) => (
        <div key={index} className="day-forecast">
          <h3>Prévisions pour le {day}</h3>
          <Swiper
            spaceBetween={50}
            slidesPerView={5}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {forecastsByDay[day].map((forecast, idx) => (
              <SwiperSlide key={idx}>
                <div className="forecast-item">
                  <p><strong>Heure :</strong> {forecast.dt_txt.split(' ')[1]}</p>
                  <p><strong>Température :</strong> {forecast.main?.temp ?? 'N/A'} °C</p>
                  <p><strong>Humidité :</strong> {forecast.main?.humidity ?? 'N/A'} %</p>
                  <p><strong>Conditions :</strong> {forecast.weather[0]?.description ?? 'N/A'}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0]?.icon ?? '01d'}@2x.png`}
                    alt="Weather Icon"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default WeatherTabs;
