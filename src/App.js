import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { sync_current_user } from './actions/userActions';
import AppNavbar from './components/AppNavbar';
import FloatingChatbot from './components/FloatingChatbot';
import ProtectedRoute from './components/ProtectedRoute';
import ApplySeller from './screens/ApplySeller';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import SellerDashboard from './screens/SellerDashboard';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import UserProfile from './screens/UserProfile';
import UserScreen from './screens/UserScreen';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sync_current_user());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <DetailScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-seller"
          element={
            <ProtectedRoute>
              <ApplySeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
      <FloatingChatbot />
    </BrowserRouter>
  );
}

export default App;
