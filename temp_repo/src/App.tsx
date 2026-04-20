/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            {/* General Modules (Read-only by default) */}
            <Route path="/production" element={
              <ProtectedRoute>
                <PlaceholderPage title="Production Tracking" />
              </ProtectedRoute>
            } />
            <Route path="/warehouse" element={
              <ProtectedRoute>
                <PlaceholderPage title="Warehouse" />
              </ProtectedRoute>
            } />

            {/* Confidential Modules */}
            <Route path="/financial" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="Financial" />
              </ProtectedRoute>
            } />
            <Route path="/cost-control" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="Cost Control" />
              </ProtectedRoute>
            } />
            <Route path="/quotation" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="Quotation" />
              </ProtectedRoute>
            } />
            <Route path="/credit-analysis" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="Credit Analysis" />
              </ProtectedRoute>
            } />
            <Route path="/permissions" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="User Permissions" />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

