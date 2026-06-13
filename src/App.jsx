import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Store & API
import { store } from './store/store';
import queryClient from './api/queryClient';
import { setupInterceptors } from './api/interceptors';

// Hooks
import { useInitializeAuth } from './hooks/useInitializeAuth';

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Cart from './pages/Cart'
import Scanner from './pages/Scanner'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Profile from './pages/Profile'
import History from './pages/History'

// Initialize Interceptors
setupInterceptors(store);

/**
 * App Content Component
 * Handles route rendering and splash screen
 */
function AppContent() {
  const [loading, setLoading] = useState(true);
  
  // Initialize Firebase authentication state on app load
  useInitializeAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

   const location = useLocation();
   const pageQR = ["/scanner", "/cart", "/history", "/profile"].includes(
  location.pathname
);


  return (
   <div
  className={`max-w-md mx-auto bg-background shadow-2xl h-dvh overflow-auto relative flex flex-col ${
    pageQR ? "pt-0" : "pt-[50px]"
  }`}
>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-primary flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white p-6 rounded-[2.5rem] shadow-2xl"
            >
              <ShoppingBag size={64} className="text-primary" strokeWidth={2.5} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h1 className="text-white font-poppins font-bold text-4xl tracking-tighter">QuickCart</h1>
              <p className="text-white/80 font-inter text-sm font-semibold mt-2">Skip the Queue, Shop Smart</p>
            </motion.div>
            
            <div className="absolute bottom-12 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/onboarding" replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  )
}

export default App


