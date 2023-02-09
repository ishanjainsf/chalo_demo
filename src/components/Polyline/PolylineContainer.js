import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Polyline } from "@react-google-maps/api";

function PolylineContainer({ stops }) {
  console.log("polyline container : ", stops);
  const [path, setPath] = React.useState([]);

  useEffect(() => {
    // const len = stops.length;
    const data = stops.filter(
      (stop) =>
        stop.stop_id && {
          lat: parseFloat(stop.lat),
          lng: parseFloat(stop.lng),
        }
    );
    setPath(data);
  }, [stops]);

  const options = {
    strokeColor: "#ff2527",
    strokeWeight: 5,
    strokeOpacity: 1,
    visible: true,
    paths: path,
    zIndex: 100000,
  };

  const onLoad = (polygon) => {
    "";
  };

  return (
    <Stack>
      <Polyline onLoad={onLoad} path={path} options={options} />
    </Stack>
  );
}

export default PolylineContainer;
