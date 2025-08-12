import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
    </Routes>
  )
}

export default App
