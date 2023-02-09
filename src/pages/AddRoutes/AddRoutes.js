import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Autocomplete,
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Stack, Typography, TextField, Button, Checkbox } from "@mui/material";
import MapContainer from "../../components/MapContainer/MapContainer";
import AutocompleteLocation from "../../components/Autocomplete/AutocompleteLocation";
import PolylineContainer from "../../components/Polyline/PolylineContainer";
import { libraries } from "../../utils/Utils";
import { useSelector, useDispatch } from "react-redux";
import { addNewRoute, updateRoute } from "../../redux/slices/routesSlice";
import { useNavigate, useLocation } from "react-router-dom";

const containerStyle = {
  width: "400px",
  height: "400px",
};

// const center = {
//   lat: -3.745,
//   lng: -38.523,
// };

function AddRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes } = useSelector((state) => state.routes);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA2DNfK6M28R372at9GsRKi1m6TqJMZFD8",
    libraries: libraries,
  });
  const [stops, setStops] = useState([
    {
      stop_id: null,
      stop_name: "",
      lat: 0.0,
      lng: 0.0,
    },
  ]);

  // Function to modify the stops
  function modifyStops(modifiedData) {
    setStops(modifiedData);
  }

  // Adding the route
  const [routeName, setRouteName] = useState("");
  function modifyRouteName(e) {
    const { value } = e.target;
    setRouteName(value);
  }

  // Prepopulating the route name as well as the stops
  function prepopulateRouteName() {
    const data = routes.filter((route) => route.route_id === location.state.id);
    setRouteName(data[0]?.route_name);
  }

  function prepopulateStops() {
    const data = routes.filter((route) => route.route_id === location.state.id);
    setStops(data[0]?.stops);
  }

  useEffect(() => {
    if (location.state) {
      if (location?.state?.id !== -1) {
        prepopulateRouteName();
        prepopulateStops();
      }
    }
  }, [location]);

  // Add route into the redux
  function addRoute() {
    const res = {
      route_name: routeName,
      direction: "UP",
      route_id: routes.length + 1,
      status: "ACTIVE",
      stops: stops.filter((stop) => stop.stop_id),
    };
    dispatch(addNewRoute(res));
    navigate({ pathname: "/" });
  }

  // Adding the option to set the route as active or inactive
  const [routeStatus, setRouteStatus] = useState(true);
  useEffect(() => {
    if (location.state.id !== -1) {
      const data = routes.filter(
        (route) => route.route_id === location.state.id
      )[0];
      console.log("data : ", data.status);
      if (data.status === "ACTIVE") {
        setRouteStatus(true);
      } else {
        setRouteStatus(false);
      }
    }
  }, [routes, location]);

  // On change the route status
  const handleChange = (event) => {
    setRouteStatus(event.target.checked);
  };

  function updateCurrentRoute() {
    console.log("routes : ", location.state.id, routes);
    const data = routes.filter((route) => route.route_id === location.state.id);

    const updatedData = { ...data[0] };
    updatedData["route_name"] = routeName;
    updatedData["status"] = routeStatus ? "ACTIVE" : "INACTIVE";
    dispatch(updateRoute(updatedData));
    navigate({ pathname: "/" });
  }

  return isLoaded ? (
    <Stack spacing={5}>
      <Stack
        direction={"row"}
        style={{
          position: "relative",
          width: "100%",
          justifyContent: "space-between",
          marginLeft: "15px",
        }}
      >
        <Stack style={{ position: "relative", width: "50%" }}>
          <Typography
            variant="h5"
            sx={{ positon: "relative", marginTop: "25px", fontWeight: "bold" }}
          >
            {location?.state?.id === -1 ? "Add routes" : "Modify routes"}
          </Typography>
          {location.state.id !== -1 && (
            <Stack direction={"row"} spacing={1} sx={{ marginTop: "10px" }}>
              <Typography sx={{ marginTop: "auto", marginBottom: "auto" }}>
                Route status
              </Typography>
              <Checkbox
                sx={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  width: "fit-content",
                }}
                checked={routeStatus}
                onChange={handleChange}
              />
            </Stack>
          )}
          <TextField
            required
            id="standard-basic"
            label="Enter route name"
            value={routeName}
            onChange={(e) => modifyRouteName(e)}
            variant="standard"
            sx={{ width: "90%", marginTop: "15px" }}
            size="small"
          />
          <AutocompleteLocation
            isLoaded={isLoaded}
            stops={stops}
            modifyStops={modifyStops}
          />
        </Stack>
        {/* <Stack style={{ position: "relative", width: "50%" }}> */}
        <MapContainer
          isLoaded={isLoaded}
          routes={stops.filter((stop) => stop.stop_id)}
          center={
            stops.filter((stop) => stop.stop_id)[0]
              ? {
                  lat: stops.filter((stop) => stop.stop_id)[0]?.lat,
                  lng: stops.filter((stop) => stop.stop_id)[0]?.lng,
                }
              : null
          }
        />
        {/* </Stack> */}
        {/* <Stack style={{ position: "fixed", top: 10, left: "50%" }}> */}
        {/* </Stack> */}
      </Stack>
      <Button
        sx={{
          position: "absolute",
          width: "45%",
          color: "white",
          textTransform: "none",
          backgroundColor: "orange",
          padding: "5px",
          bottom: 25,
          left: 35,
        }}
        disabled={
          routeName.trim().length === 0 ||
          stops.filter((stop) => stop.stop_id) === 0
            ? true
            : false
        }
        onClick={() =>
          location?.state?.id === -1 ? addRoute() : updateCurrentRoute()
        }
      >
        {location.state.id === -1 ? "Add route" : "Modify route"}
      </Button>
    </Stack>
  ) : (
    <Typography>Loading...</Typography>
  );
}

export default AddRoutes;
