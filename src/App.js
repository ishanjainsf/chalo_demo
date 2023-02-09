import React, { lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Registering the components
const ViewRoutes = lazy(() => import("./pages/ViewRoutes/ViewRoutes"));
const AddRoutes = lazy(() => import("./pages/AddRoutes/AddRoutes"));

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ViewRoutes />} />
        <Route exact path="/add-route" element={<AddRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
