import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import "./components/stylesheets/Index.css";
import "./components/stylesheets/Dashboard.css";
import "./components/widgets/widgets.css";

import Index from './components/Index';
import Dashboard from './components/Dashboard';

function App() {
  const {href, host} = window.location;
  if (href.includes('http:') && host.includes('crew')) {
    window.location.href = 'https://' + host;
  }
  return (
    <Router>

      <div className='App'>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

      </div>

    </Router>
  );
}

export default App;
