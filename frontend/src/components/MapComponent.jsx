import React, { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import cat from '../assets/images/cat.png'
import dog from '../assets/images/dog.png'
import elephant from '../assets/images/elephant.webp'
import '../CustomMarker.css' // Import CSS file for custom marker styles

const MapComponent = () => {
  const [centerPosition, setCenterPosition] = useState([16.1622, 74.8298]) // Initial center position [latitude, longitude]
  const [markers, setMarkers] = useState([
    // Initial markers for dog
    [[16.1622, 74.8298]],
    // Initial markers for cat
    [[16.1605, 74.8323]],
    // Initial markers for elephant
    [[16.1585, 74.8278]],
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Update markers for each animal
      const newMarkers = markers.map((animalMarkers) => [
        ...animalMarkers,
        [
          animalMarkers[animalMarkers.length - 1][0] + getRandomOffset(),
          animalMarkers[animalMarkers.length - 1][1] + getRandomOffset(),
        ],
      ])
      setMarkers(newMarkers)
    }, 5000)

    return () => clearInterval(interval)
  }, [markers])

  useEffect(() => {
    // Calculate the center of all markers
    const calculateCenter = () => {
      const latitudes = []
      const longitudes = []
      markers.forEach((animalMarkers) => {
        animalMarkers.forEach((marker) => {
          latitudes.push(marker[0])
          longitudes.push(marker[1])
        })
      })
      const minLat = Math.min(...latitudes)
      const maxLat = Math.max(...latitudes)
      const minLng = Math.min(...longitudes)
      const maxLng = Math.max(...longitudes)
      const centerLat = (minLat + maxLat) / 2
      const centerLng = (minLng + maxLng) / 2
      setCenterPosition([centerLat, centerLng])
    }

    calculateCenter()
  }, [markers])

  const circleOptions = {
    color: 'blue', // Color of the circle outline
    fillColor: 'lightblue', // Color of the circle fill
    fillOpacity: 0.5, // Opacity of the circle fill
  }

  return (
    <MapContainer
      center={centerPosition}
      zoom={15}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Map through markers array for each animal */}
      {markers.map((animalMarkers, animalIndex) => (
        <React.Fragment key={animalIndex}>
          {/* Lines connecting consecutive markers for each animal */}
          <Polyline
            positions={animalMarkers}
            color={getLineColor(animalIndex)}
          />
          {/* Markers for each animal */}
          {animalMarkers.map((position, markerIndex) => (
            <Marker
              key={markerIndex}
              position={position}
              icon={getMarkerIcon(animalIndex)}
            >
              {/* Popup content */}
              <Popup>
                Animal: {getAnimalName(animalIndex)} <br /> Position:{' '}
                {position[0]}, {position[1]}
              </Popup>
            </Marker>
          ))}
        </React.Fragment>
      ))}
      {/* Big circle around all markers */}
      <Circle
        center={centerPosition}
        radius={calculateRadius(markers)}
        pathOptions={circleOptions}
      />
    </MapContainer>
  )
}

// Function to calculate the radius of the circle that includes all markers
const calculateRadius = (markers) => {
  const latLngs = markers.flat().map((marker) => L.latLng(marker[0], marker[1]))
  const bounds = L.latLngBounds(latLngs)
  return bounds.getNorthEast().distanceTo(bounds.getSouthWest()) / 2
}

// Function to get animal name based on index
const getAnimalName = (index) => {
  switch (index) {
    case 0:
      return 'Dog'
    case 1:
      return 'Cat'
    case 2:
      return 'Elephant'
    default:
      return 'Animal'
  }
}

// Function to get marker icon for each animal
const getMarkerIcon = (index) => {
  switch (index) {
    case 0:
      return L.icon({
        iconUrl: dog,
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 16], // Center the icon
      })
    case 1:
      return L.icon({
        iconUrl: cat,
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 16], // Center the icon
      })
    case 2:
      return L.icon({
        iconUrl: elephant,
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 16], // Center the icon
      })
    default:
      return null
  }
}

// Function to get line color for each animal
const getLineColor = (index) => {
  switch (index) {
    case 0:
      return 'red' // Red color for dog
    case 1:
      return 'blue' // Blue color for cat
    case 2:
      return 'green' // Green color for elephant
    default:
      return 'black' // Default color for other animals
  }
}

// Function to generate random offset for movement
const getRandomOffset = () => (Math.random() - 0.5) * 0.001

export default MapComponent
