import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Autocomplete,
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import {
  Stack,
  TextField,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";
import MapContainer from "../../components/MapContainer/MapContainer";
import AutocompleteLocation from "../../components/Autocomplete/AutocompleteLocation";
import { useSelector } from "react-redux";
import { libraries } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import * as BsIcons from "react-icons/bs";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "5px",
};

// const center = {
//   lat: -3.745,
//   lng: -38.523,
// };

const Card = ({ props, selected }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [id, setId] = useState("");
  return (
    <Stack
      sx={{
        height: "50px",
        width: "fit-content",
        borderRadius: "10px",
        // border: "1px solid orange",
        borderLeft: "5px solid orange",
        padding: "10px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        marginBottom: "2.5px",
        marginTop: "2.5px",
        backgroundColor: selected ? "#e4e4e4" : "white",
      }}
    >
      <Stack direction={"row"}>
        <Stack>
          <Stack direction={"row"}>
            <Typography sx={{ fontSize: "15px" }}>
              <strong>{props?.route_name}</strong>
            </Typography>
            <Typography
              sx={{ marginLeft: "2.5px", cursor: "pointer" }}
              onClick={() => {
                setId(props.route_id);
                handleOpen();
              }}
            >
              <BsIcons.BsInfoCircle color="grey" size="12.5px" />
            </Typography>
          </Stack>

          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: "12px", color: "grey" }}>
              Direction
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              {props?.direction}
            </Typography>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: "12px" }}>
              There are {props?.stops.length} stops in this route
            </Typography>
          </Stack>
        </Stack>
        <Typography
          style={{ fontSize: "8px", color: "grey", cursor: "pointer" }}
          onClick={() =>
            navigate("/add-route", { state: { id: props?.route_id } })
          }
        >
          Edit
        </Typography>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction={"row"}
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {props.route_name}
            </Typography>
            <Typography sx={{ cursor: "pointer" }} onClick={handleClose}>
              X
            </Typography>
          </Stack>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <table style={{ position: "relative", width: "100%" }}>
              <thead>
                <tr>
                  <th>Stop name</th>
                  <th>Stop lat</th>
                  <th>Stop lng</th>
                </tr>
              </thead>
              <tbody>
                {props.stops.map((stop) => (
                  <tr>
                    <td>{stop.stop_name}</td>
                    <td>{stop.lat}</td>
                    <td>{stop.lng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Typography>
        </Box>
      </Modal>
    </Stack>
  );
};

function exportTableToExcel(tableID, filename = "") {
  var downloadLink;
  var dataType = "application/vnd.ms-excel";
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

  // Specify file name
  filename = filename ? filename + ".xls" : "excel_data.xls";

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(["\ufeff", tableHTML], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = "data:" + dataType + ", " + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}

function ViewRoutes() {
  const routes = useSelector((state) => state.routes.routes);
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: "AIzaSyA2DNfK6M28R372at9GsRKi1m6TqJMZFD8",
    googleMapsApiKey: "AIzaSyCnd6OQAhCYHrCq1PERbyNbxojViavNzq0",
    libraries: libraries,
  });

  // Get the ids of all the indices which you are required to display
  const [displayRouteIds, setDisplayRouteIds] = useState([]);
  useEffect(() => {
    const data = routes.map((item) => item.route_id);
    setDisplayRouteIds(data);
  }, [routes]);

  // Function to display the routes
  function handleDisplayRoutes(id) {
    if (displayRouteIds.includes(id)) {
      let index = displayRouteIds.indexOf(id);
      displayRouteIds.splice(index, 1);
      setDisplayRouteIds([...displayRouteIds]);
    } else {
      setDisplayRouteIds([...displayRouteIds, id]);
    }
  }

  return (
    <Stack
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Stack
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        direction={"row"}
      >
        <Typography
          style={{
            marginLeft: "10px",
            marginTop: "auto",
            marginBottom: "auto",
            fontSize: "20px",
          }}
          variant="h3"
        >
          <strong>View routes</strong>
        </Typography>
        <Stack sx={{ marginRight: "15px" }} direction={"row"} spacing={2}>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              textTransform: "none",
              height: "fit-content",
              marginTop: "auto",
              marginBottom: "auto",
            }}
            onClick={() => navigate("/add-route", { state: { id: -1 } })}
          >
            Add new route
          </Button>
          <Button
            style={{
              backgroundColor: "transparent",
              border: "2px solid black",
              color: "black",
              textTransform: "none",
              height: "fit-content",
              marginTop: "auto",
              marginBottom: "auto",
            }}
            onClick={() => exportTableToExcel("tblData", "routes")}
          >
            Export routes
          </Button>
        </Stack>
      </Stack>

      {routes.length > 0 ? (
        <Stack spacing={1}>
          <Stack
            direction={"row"}
            spacing={2}
            sx={{
              margin: "10px",
              width: "100%",
              overflowY: "scroll",
              cursor: "pointer",
            }}
          >
            {routes?.map((route, idx) => (
              <Stack
                key={idx}
                onClick={() => handleDisplayRoutes(route.route_id)}
                sx={{ width: "fit-content" }}
              >
                <Card
                  props={route}
                  selected={displayRouteIds.includes(route.route_id)}
                />
              </Stack>
            ))}
          </Stack>
          <Typography
            sx={{
              marginLeft: "15px",
              fontWeight: 500,
              marginBottom: "10px",
              fontSize: "12.5px",
              color: "grey",
            }}
          >
            Click on the route card to control what route to be displayed in the
            map
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            margin: "10px",
            width: "100%",
            overflowY: "scroll",
            color: "grey",
            fontWeight: "bold",
          }}
        >
          There are no routes currently. Kindly add to see them below.
        </Stack>
      )}

      <Stack>
        <MapContainer
          isLoaded={isLoaded}
          customStyle={{
            width: "100vw",
            height: "100vh",
            zIndex: 100,
          }}
          autolocationControl={false}
          routes={routes}
          displayRouteIds={displayRouteIds}
          center={
            routes.length > 0
              ? {
                  lat: routes[0]?.stops[0]?.lat,
                  lng: routes[0]?.stops[0]?.lng,
                }
              : null
          }
        />
      </Stack>

      {/* <Stack style={{ position: "fixed", top: 10, left: "50%" }}> */}
      {/* </Stack> */}

      <table id="tblData" style={{ display: "none" }}>
        <thead>
          <tr>
            <th>Route id</th>
            <th>Route name</th>
            <th>Status</th>
            <th>Direction</th>
            <th>Stop name</th>
            <th>Lat</th>
            <th>Lng</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((route) =>
            route.stops.map((stop) => (
              <tr>
                <td>{route.route_id}</td>
                <td>{route.route_name}</td>
                <td>{route.status}</td>
                <td>{route.direction}</td>
                <td>{stop.stop_name}</td>
                <td>{stop.lat}</td>
                <td>{stop.lng}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Stack>
  );
}

export default ViewRoutes;
