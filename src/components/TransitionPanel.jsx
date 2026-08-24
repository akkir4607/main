import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '../context/TransitionContext';
import './TransitionPanel.css';

const ease = [0.83, 0, 0.17, 1];

export default function TransitionPanel() {
  const { phase, onCovered, onRevealed } = useTransition();

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          className="transition-panel"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={
            phase === 'covering'
              ? { clipPath: 'inset(0% 0% 0% 0%)' }
              : { clipPath: 'inset(0% 0% 100% 0%)' } // wipes out the TOP, "goes upward"
          }
          transition={{ duration: 0.7, ease }}
          onAnimationComplete={() => {
            if (phase === 'covering') onCovered();
            if (phase === 'revealing') onRevealed();
          }}
        />
      )}
    </AnimatePresence>
  );
}