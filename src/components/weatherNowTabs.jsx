import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CityTab from './cityTabs';

const WeatherNowTabs = ({ userLocationData, weatherDataList }) => {
  const [activeCity, setActiveCity] = useState('Ma position'); // Gérer l'onglet actif

  return (
    <Tabs
      activeKey={activeCity}
      onSelect={(k) => setActiveCity(k)} // Changer d'onglet quand l'utilisateur sélectionne une ville
      id="city-tabs"
      className="mb-3"
    >
      {/* Onglet pour la localisation de l'utilisateur */}
      {userLocationData && (
        <Tab eventKey="Ma position" title={userLocationData?.city?.name || "Ma position"}>
          <CityTab data={userLocationData} />
        </Tab>
      )}

      {/* Onglets pour les villes ajoutées */}
      {weatherDataList.map((weatherItem, index) => (
        <Tab eventKey={weatherItem.city} title={weatherItem.city} key={index}>
          <CityTab data={weatherItem.data} />
        </Tab>
      ))}
    </Tabs>
  );
};

export default WeatherNowTabs;
