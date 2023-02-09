import React, { useEffect, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Stack, TextField, Typography, Button } from "@mui/material";
import AddLocationAltSharpIcon from "@mui/icons-material/AddLocationAltSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import * as MdIcons from "react-icons/md";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { CelebrationTwoTone } from "@mui/icons-material";
import { libraries } from "../../utils/Utils";
import { useLocation } from "react-router-dom";

function AutocompleteLocation({ stops, modifyStops, isLoaded }) {
  const location = useLocation();
  // Function to click on the add route
  function addMoreStops() {
    setAutocomplete(null);
    let obj = {
      stop_id: "",
      stop_name: "",
      lat: 0.0,
      lng: 0.0,
    };
    // modifyStops(stops);
    modifyStops([...stops, obj]);
  }

  // Function to remove a particular stop
  function removeStop(item, index) {
    const { stop_id } = item;
    delete stops[index];
    const data = stops.filter((stop) => stop !== undefined);
    // setStops(data);
    modifyStops(stops);
  }

  // load after autocomplete
  const [autocomplete, setAutocomplete] = useState(null);
  function onLoad(autocomplete) {
    console.log("going into the on load function");
    setAutocomplete(autocomplete);
  }

  function onPlaceChanged(index) {
    if (autocomplete !== null) {
      const info = autocomplete.getPlace();
      console.log("autocomplete info : ", autocomplete);
      // Creating the deep copy of the stops array
      const data = { ...stops };
      let obj = {
        stop_id: info.place_id,
        stop_name: info.address_components[0].short_name,
        lat: parseFloat(info.geometry.location.lat()),
        lng: parseFloat(info.geometry.location.lng()),
      };
      data[index] = obj;
      //   setStops(Object.values(data));
      modifyStops(Object.values(data));
      // modifyStops(stops);
    } else {
      console.log("Autocomplete is not loaded yet");
    }
  }

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        margin: "0px",
        marginTop: "45px",
      }}
      spacing={3}
    >
      {stops?.map((item, index) => (
        <Stack
          //   direction={"row"}
          spacing={1}
          sx={{ position: "relative", width: "100%" }}
          key={index}
        >
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={() => onPlaceChanged(index)}
            // onPlaceChanged={onPlaceChanged}
          >
            <TextField
              required
              placeholder={location.state.id !== -1 && item.stop_name}
              disabled={location.state.id !== -1 ? true : false}
              // placeholder={item.stop_name}
              //   name={item.stop_id}
              id="outlined-required"
              label="Stop name"
              size="small"
              sx={{
                width: "90%",
              }}
              InputLabelProps={{
                shrink: true,
              }}
              // onChange={() => onPlaceChanged(index)}
            />
          </Autocomplete>
          <Stack
            sx={{ position: "relative", width: "90%", alignItems: "flex-end" }}
          >
            {index !== 0 && location.state.id === -1 && (
              <Stack
                sx={{
                  position: "relative",
                  width: "fit-content",
                  color: "grey",
                  fontSize: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderBottom: "1px solid grey",
                }}
                onClick={() => removeStop(item, index)}
              >
                {/* <CloseSharpIcon color="grey" /> */}
                Remove stop
              </Stack>
            )}
          </Stack>
        </Stack>
      ))}
      <Stack
        sx={{
          position: "relative",
          width: "90%",
          color: "white",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* <MdIcons.MdOutlineAddLocationAlt color="white" size={"16px"} /> */}
        {stops?.filter((stop) => !stop?.stop_id).length > 0 && (
          <Typography
            variant="h2"
            sx={{ color: "red", fontSize: "12px", marginTop: "-25px" }}
          >
            Kindly add the stop before adding another
          </Typography>
        )}
        {location.state.id === -1 && (
          <Button
            sx={{
              position: "relative",
              width: "fit-content",
              backgroundColor: "grey",
              borderRadius: "2px",
              padding: "5px",
              fontSize: "10px",
              marginTop: "15px",
              cursor: "pointer",
              textTransform: "none",
              color: "white",
            }}
            disabled={
              stops?.filter((stop) => !stop?.stop_id).length > 0 ? true : false
            }
            onClick={() =>
              // stops?.filter((stop) => stop?.stop_id === -1).length > 0 &&
              addMoreStops()
            }
          >
            Add stop
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

export default AutocompleteLocation;
