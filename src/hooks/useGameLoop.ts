import { useState, useEffect, useCallback } from 'react';
import { Position, GameState } from '../types/game';
import { useKeyPress } from './useKeyPress';

const GRID_SIZE = 20;

const getHighScore = (): number => {
  const saved = localStorage.getItem('snakeHighScore');
  return saved ? parseInt(saved) : 0;
};

// 生成随机食物位置
const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    isGameOver: false,
    score: 0,
    highScore: getHighScore(),
    speed: 200  // 默认中速
  });

  // 添加键盘控制
  useKeyPress(setGameState);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prevState => {
      const newHead = { ...prevState.snake[0] };

      // 根据方向移动蛇头
      switch (prevState.direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // 检查是否撞墙
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        return { ...prevState, isGameOver: true };
      }

      // 检查是否撞到自己
      if (prevState.snake.some(segment => 
        segment.x === newHead.x && segment.y === newHead.y
      )) {
        return { ...prevState, isGameOver: true };
      }

      const newSnake = [newHead, ...prevState.snake];
      
      // 检查是否吃到食物
      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        const newScore = prevState.score + 1;
        const newHighScore = Math.max(newScore, prevState.highScore);
        
        if (newHighScore > prevState.highScore) {
          localStorage.setItem('snakeHighScore', newHighScore.toString());
        }

        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
          highScore: newHighScore
        };
      }

      // 如果没吃到食物，移除蛇尾
      newSnake.pop();

      return {
        ...prevState,
        snake: newSnake
      };
    });
  }, [gameState.isGameOver]);

  // 设置游戏循环
  useEffect(() => {
    const gameLoop = setInterval(moveSnake, gameState.speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameState.speed]);

  return {
    ...gameState,
    setGameState
  };
};