import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import 'swiper/swiper-bundle.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../assets/css/home.css'; // Ton fichier de style
import WeatherTabs from './weatherTabs'; // Le composant qui gère les onglets
import Loader from './loader'; // Le loader pour l'attente
import '../assets/css/home.css'; 

const API_KEY = "f829cab68807f74cd6f30ecf447646e0";

const Home = () => {
  const [weatherDataList, setWeatherDataList] = useState([]); // Liste des prévisions météo pour plusieurs villes
  const [currentWeatherData, setCurrentWeatherData] = useState(null); // Météo actuelle pour une ville
  const [city, setCity] = useState(''); // Ville saisie par l'utilisateur
  const [citiesWeatherData, setCitiesWeatherData] = useState([]); // Tableau pour stocker les données de plusieurs villes
  const [userLocationData, setUserLocationData] = useState(null); // Données des prévisions pour la localisation de l'utilisateur

  const addCityWeatherData = (cityWeatherData) => {
    setCitiesWeatherData((prevCities) => [...prevCities, cityWeatherData]); // Ajouter une nouvelle ville sans écraser les précédentes
  };

  // Utilisation de useGeolocated pour obtenir la géolocalisation de l'utilisateur
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  // Fonction pour récupérer la météo actuelle pour une ville ou la géolocalisation
  const fetchCurrentWeather = (latitude, longitude) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeatherData(data); // Stocker la météo actuelle
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données météo", error);
      });
  };

  // Fonction pour récupérer les prévisions météo pour une ville ou la géolocalisation
  const fetchForecastDataByCoords = (latitude, longitude) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`
    )
      .then((res) => res.json())
      .then((data) => {
        setUserLocationData(data); // Stocker les prévisions météo basées sur la localisation
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données des prévisions", error);
      });
  };

  // Fonction pour récupérer la météo actuelle et les prévisions pour une ville saisie
  const fetchWeatherDataByCity = (cityName) => {
    // Météo actuelle
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=fr`
    )
      .then((res) => res.json())
      .then((data) => {
        // Ajouter la nouvelle ville à la liste des villes avec la météo actuelle
        addCityWeatherData({ city: cityName, data: data });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données météo", error);
      });

    // Prévisions météo
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=fr`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherDataList((prevWeatherDataList) => [
          ...prevWeatherDataList,
          { city: cityName, data: data },
        ]);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des prévisions météo", error);
      });
  };

  // Gérer la saisie de la ville
  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleAddCity = () => {
    if (city.trim() !== '') {
      fetchWeatherDataByCity(city); // Ajouter la ville et récupérer les données météo
      setCity(''); // Réinitialiser le champ input
    }
  };

  // Utiliser la géolocalisation pour récupérer la météo actuelle et les prévisions
  useEffect(() => {
    if (coords) {
      fetchCurrentWeather(coords.latitude, coords.longitude); // Récupérer la météo actuelle pour la localisation
      fetchForecastDataByCoords(coords.latitude, coords.longitude); // Récupérer les prévisions météo
    }
  }, [coords]);

  if (!isGeolocationAvailable) {
    return <div>Votre navigateur ne supporte pas la géolocalisation.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>La géolocalisation est désactivée. Veuillez l'activer.</div>;
  }

  return (
    <div className="container">
      <h1>Météo actuelle et prévisions</h1>

      {/* Saisie de la ville */}
      <input type="text" value={city} onChange={handleChange} placeholder="Ajouter une ville" />
      <button type="button" className='btn btn-primary mt-3 mb-3' onClick={handleAddCity}>
        Ajouter une ville
      </button>

      {/* Météo actuelle */}

      {/* Onglets des prévisions */}
      {userLocationData || weatherDataList.length > 0 ? (
        <WeatherTabs
          currentWeatherData={currentWeatherData}
          userLocationData={userLocationData}
          weatherDataList={weatherDataList}
          citiesWeatherData={citiesWeatherData} // Transmettre toutes les villes et leurs données météo
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
