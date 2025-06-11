import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRouts'
import Login from './pages/Login'


function App() {

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<h1>Home Page</h1>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<h1>Register Page</h1>} />
      </Routes>
    </Router>
  )
}

export default App
