import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdditionPage from './pages/AdditionPage'
import MultiplicationPage from './pages/MultiplicationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addition" element={<AdditionPage />} />
        <Route path="/multiplication" element={<MultiplicationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
