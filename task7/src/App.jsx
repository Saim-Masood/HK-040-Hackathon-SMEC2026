import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MeetingProvider } from '@/contexts/MeetingContext';
import { Home } from '@/pages/Home';
import { Meeting } from '@/pages/Meeting';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <MeetingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />
        </Routes>
      </MeetingProvider>
    </BrowserRouter>
  );
}

export default App;
