import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import './App.css'
import Subjects from './pages/BookSlots';
import Levels from './pages/Levels';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Subjects />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
