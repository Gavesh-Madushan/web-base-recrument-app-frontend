import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button, CircularProgress, Grid, TextField, useTheme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// Fix default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Point where the icon anchors
  popupAnchor: [0, -41],
});

// Red marker icon for selected state
const selectedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Same size as default
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Red marker icon for selected state
const ariaIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Same size as default
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Custom icon for current location
const currentLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1673/1673221.png", // Use any custom icon URL
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon
  popupAnchor: [0, -32], // Popup position relative to the icon
});

const MapComponent = ({
  locations = [],
  arias = [],
  ariaCircleSize = 0,
  onMapClick = () => {},
  onMarkerClick = () => {},
  showCurrentLocation = false,
  currentLocationRadius = 0,
  zoom = 10,
  centerLocation = [6.9271, 79.8612], //colombo
  searchLocation = false,
  selectedMarker = 0,
}: {
  locations?: { lat: number; lng: number; name: string }[];
  arias?: { lat: number; lng: number; name: string }[];
  ariaCircleSize?: number;
  onMapClick?: (any) => void;
  onMarkerClick?: (any) => void;
  showCurrentLocation?: boolean;
  currentLocationRadius?: number;
  zoom?: number;
  centerLocation?: number[];
  searchLocation?: boolean;
  selectedMarker?: number;
}) => {
  const [center, setCenter] = useState<number[]>(centerLocation);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const theme: any = useTheme();
  const [zoomSize, setZoomSize] = useState<number>(zoom);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    // Fetch the user's current location on mount
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = [latitude, longitude];
          setCenter(userLocation);
          setCurrentLocation(userLocation);
        },
        (error) => {
          console.error("Error fetching location: ", error);
          alert("Unable to fetch your location. Defaulting to Colombo.");
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      alert("Please enter a location to search.");
      return;
    }

    try {
      setLoadingSearch(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json`);
      const data = await response.json();

      if (data.length === 0) {
        alert("Location not found. Please try again.");
        setLoadingSearch(false);
        return;
      }

      const { lat, lon } = data[0];
      setCenter([parseFloat(lat), parseFloat(lon)]);
      setZoomSize(16); // Set the zoom level to 15 when a location is found
      setLoadingSearch(false);
    } catch (error) {
      setLoadingSearch(false);
      console.error("Error searching for location: ", error);
      alert("Error searching for location. Please try again.");
    }
  };

  return (
    <Grid container sx={{ height: "100%", width: "100%" }}>
      {/* Search bar */}
      {searchLocation && (
        <Grid item xs={12} sx={{ position: "absolute", zIndex: 1000 }}>
          <TextField
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "5px", width: "250px" }}
          />
          <Button
            onClick={handleSearch}
            variant="contained"
            size="medium"
            sx={{ ...theme.typography.button, marginLeft: "10px" }}
            disabled={loadingSearch || searchQuery === ""}
          >
            {loadingSearch ? <CircularProgress size={25} /> : <SearchOutlinedIcon />}
          </Button>
        </Grid>
      )}
      <Grid item xs={12} sx={{ height: "100%", width: "100%" }}>
        {/* Map */}
        <MapContainer center={center} zoom={zoomSize} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <MapEvents onMapClick={onMapClick} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Current location marker and circle */}
          {showCurrentLocation && currentLocation && (
            <>
              <Marker position={currentLocation} icon={currentLocationIcon}>
                <Popup>Your Current Location</Popup>
              </Marker>
              <Circle
                center={currentLocation}
                radius={currentLocationRadius}
                pathOptions={{
                  color: theme.palette.primary.main,
                  fillOpacity: 0.2,
                }}
              />
            </>
          )}

          {arias.length > 0 && ariaCircleSize > 0 && (
            <>
              {arias.map((circle, index) => (
                <Circle
                  key={index}
                  center={[circle?.lat, circle?.lng]}
                  radius={ariaCircleSize}
                  pathOptions={{
                    color: theme.palette.primary.main,
                    fillOpacity: 0.2,
                  }}
                />
              ))}
              {arias.map((circle, index) => (
                <Marker
                  key={index}
                  position={[circle?.lat, circle?.lng]}
                  icon={selectedIcon}
                  eventHandlers={{
                    mouseover: (e) => {
                      // Open popup when mouse hovers over the marker
                      e.target.openPopup();
                    },
                    mouseout: (e) => {
                      // Close popup when mouse leaves the marker
                      e.target.closePopup();
                    },
                    click: (e) => {
                      // Zoom in and center the map on the marker when clicked
                      e.target._map.setView(e.target.getLatLng(), 15); // Adjust the zoom level (e.g., 15)
                    },
                  }}
                >
                  <Popup>{circle.name || ""}</Popup>
                </Marker>
              ))}
            </>
          )}

          {/* Render other markers */}
          {locations.length > 0 &&
            locations.map((location, index) => (
              <div key={index}>
                <Marker
                  position={[location?.lat, location?.lng]}
                  eventHandlers={{
                    click: () => {
                      onMarkerClick(location);
                    },
                    mouseover: (e) => {
                      // Open popup when mouse hovers over the marker
                      e.target.openPopup();
                    },
                    mouseout: (e) => {
                      // Close popup when mouse leaves the marker
                      e.target.closePopup();
                    },
                  }}
                  icon={selectedMarker === location.id ? selectedIcon : defaultIcon}
                >
                  <Popup>{location.name || "Selected Location"}</Popup>
                </Marker>
                <Circle
                  center={[location.lat, location.lng]}
                  radius={currentLocationRadius}
                  pathOptions={{
                    color: theme.palette.secondary.main,
                    fillOpacity: 0.2,
                  }}
                />
              </div>
            ))}
          <MapView center={center} zoom={zoomSize} />
        </MapContainer>
      </Grid>
    </Grid>
  );
};

// Component to dynamically update map view
const MapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default MapComponent;
