import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HosteliteView from "./pages/HosteliteView";
import RiderDashboard from "./components/RiderDashboard/RiderDashboard";
import RouteToCollege from "./pages/RouteToCollege";
import Network from "./pages/Network";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hostelite" element={<HosteliteView />} />
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/route" element={<RouteToCollege />} />
        <Route path="/rider/network" element={<Network />} />
      </Routes>
    </Router>
  );
}

export default App;
