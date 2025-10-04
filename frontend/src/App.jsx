import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RiderView from "./pages/RiderView";
import HosteliteView from "./pages/HosteliteView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rider" element={<RiderView />} />
        <Route path="/hostelite" element={<HosteliteView />} />
      </Routes>
    </Router>
  );
}

export default App;
