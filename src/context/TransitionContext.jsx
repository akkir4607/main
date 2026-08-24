import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  // 'idle' -> 'covering' (logo grows to center, panel wipes up)
  // -> 'revealing' (route swapped underneath, logo shrinks back into nav, panel wipes away)
  const [phase, setPhase] = useState('idle');
  const [pendingPath, setPendingPath] = useState(null);

  const navigateWithTransition = useCallback((path) => {
    setPendingPath((current) => {
      // ignore clicks mid-transition or to the current page
      return current;
    });
    setPhase((current) => {
      if (current !== 'idle') return current;
      setPendingPath(path);
      return 'covering';
    });
  }, []);

  const onCovered = useCallback(() => {
    setPendingPath((path) => {
      if (path) navigate(path);
      return path;
    });
    setPhase('revealing');
  }, [navigate]);

  const onRevealed = useCallback(() => {
    setPhase('idle');
    setPendingPath(null);
  }, []);

  return (
    <TransitionContext.Provider value={{ phase, navigateWithTransition, onCovered, onRevealed }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);