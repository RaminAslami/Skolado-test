import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import FetchData from "./components/FetchData";
import React, { Component } from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={""} element={<Dashboard />} />
        <Route exact path={"/my-component"} element={<FetchData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
