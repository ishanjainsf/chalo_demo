import React from "react";
import { InfoBox, Marker } from "@react-google-maps/api";
import Stack from "@mui/material/Stack";

function MapMarkerContainer({ center, item }) {
  const options = { closeBoxURL: "", enableEventPropagation: true };
  const onLoadInfo = (infoBox) => {};

  console.log("map marker : ", center)

  return (
    // <InfoBox
    //   onLoad={onLoadInfo}
    //   options={options}
    //   position={center}
    //   zIndex={1}
    //   //   zIndex={activeHotelInMap === item.hotelId ? 100000000000 : -1}
    // >
    //   <Stack>This contains the map marker container</Stack>
    // </InfoBox>
    <Marker position={center} />
  );
}

export default MapMarkerContainer;
