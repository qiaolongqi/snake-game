import { useEffect } from 'react';
import { GameState } from '../types/game';

export const useKeyPress = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      setGameState(prevState => {
        if (prevState.isGameOver) return prevState;

        const key = event.key.toLowerCase();
        
        // 防止蛇反向移动
        switch (key) {
          case 'arrowup':
          case 'w':
            if (prevState.direction === 'DOWN') return prevState;
            return { ...prevState, direction: 'UP' };
          
          case 'arrowdown':
          case 's':
            if (prevState.direction === 'UP') return prevState;
            return { ...prevState, direction: 'DOWN' };
          
          case 'arrowleft':
          case 'a':
            if (prevState.direction === 'RIGHT') return prevState;
            return { ...prevState, direction: 'LEFT' };
          
          case 'arrowright':
          case 'd':
            if (prevState.direction === 'LEFT') return prevState;
            return { ...prevState, direction: 'RIGHT' };
          
          default:
            return prevState;
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setGameState]);
};