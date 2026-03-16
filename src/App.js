import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ApplySeller from './screens/ApplySeller';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import SellerDashboard from './screens/SellerDashboard';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import UserProfile from './screens/UserProfile';
import UserScreen from './screens/UserScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/services/:id" element={<DetailScreen />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/apply-seller" element={<ApplySeller />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/users" element={<UserScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
