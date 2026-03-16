import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/services/:id" element={<DetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
