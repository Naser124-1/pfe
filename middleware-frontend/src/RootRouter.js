import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import MiddlewareDashboard from './MiddlewareDashboard';
import ApiFront from './App'; // Ton frontend pizza-demo (App.js)

function RootRouter() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Middleware</Link>
        <Link to="/api">Pizza Demo API Frontend</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MiddlewareDashboard />} />
        <Route path="/api/*" element={<ApiFront />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RootRouter;
