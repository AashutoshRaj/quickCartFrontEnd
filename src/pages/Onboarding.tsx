import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Smartphone, ChevronRight, ShieldCheck } from 'lucide-react';
import { PATHS } from '../app/paths';

/**
 * Onboarding Page Component
 * Displays introductory content with animated illustrations
 * Guides new users to the login page
 *
 * @returns {React.ReactElement} Onboarding page with animated content
 */
const Onboarding: React.FC = (): React.ReactElement => {
  return (
    <div className="min-h-screen bg-background flex flex-col px-8 py-12 justify-between">
      <div className="space-y-12 mt-10">
        {/* Animated Illustration */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Smartphone size={100} className="text-primary" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 bg-white p-4 rounded-3xl shadow-xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <ShoppingBag size={32} className="text-primary-container" />
            </motion.div>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h1 className="text-on-surface font-poppins font-bold text-3xl leading-tight">
            Scan products as you shop
          </h1>
          <p className="text-secondary font-inter text-base leading-relaxed">
            Just point your camera at any product barcode to add it to your cart instantly. No more waiting in lines.
          </p>
        </motion.div>
      </div>

      {/* Action Area */}
      <div className="space-y-6">
        {/* Pagination Mockup */}
        <div className="flex justify-center gap-2">
          <div className="w-8 h-2 bg-primary rounded-full" />
          <div className="w-2 h-2 bg-primary/20 rounded-full" />
          <div className="w-2 h-2 bg-primary/20 rounded-full" />
        </div>

        <Link
          to={PATHS.LOGIN}
          className="w-full bg-primary flex items-center justify-center gap-3 py-5 rounded-2xl shadow-xl hover:bg-primary/90 transition-all text-white font-poppins font-bold text-lg group"
        >
          I'm a Customer
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to={PATHS.STAFF_LOGIN}
          className="w-full bg-white border border-outline/10 flex items-center justify-center gap-3 py-4 rounded-2xl shadow-sm hover:bg-background transition-all text-on-surface font-poppins font-semibold text-base group"
        >
          <ShieldCheck size={18} className="text-primary" />
          Staff / Security Guard
        </Link>
      </div>
    </div>
  );
};

export default Onboarding;
