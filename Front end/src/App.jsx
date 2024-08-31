import { useState } from "react";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import HabitManager from "./Pages/HabitManager.jsx";
import AuthPage from "./Pages/user.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/HabitManager" element={<HabitManager />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
