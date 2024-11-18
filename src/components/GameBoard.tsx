import { useEffect, useRef } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Position } from '../types/game';

const CELL_SIZE = 20;
const GRID_SIZE = 20;

const GameBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setGameState, ...gameState } = useGameLoop();

  // 绘制蛇
  const drawSnake = (ctx: CanvasRenderingContext2D, snake: Position[]) => {
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });
  };

  // 绘制食物
  const drawFood = (ctx: CanvasRenderingContext2D, food: Position) => {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, CELL_SIZE * GRID_SIZE, CELL_SIZE * GRID_SIZE);
    
    // 绘制背景网格
    ctx.strokeStyle = '#ddd';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.strokeRect(
          i * CELL_SIZE,
          j * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    // 绘制蛇和食物
    drawSnake(ctx, gameState.snake);
    drawFood(ctx, gameState.food);

  }, [gameState]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        <div>分数: {gameState.score}</div>
        <div style={{ 
          fontSize: '18px',
          color: '#e67e22'
        }}>
          最高分: {gameState.highScore}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CELL_SIZE * GRID_SIZE}
        height={CELL_SIZE * GRID_SIZE}
        style={{ 
          border: '2px solid black',
          margin: '20px'
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            marginRight: '10px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          重新开始
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('snakeHighScore');
            window.location.reload();
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            marginLeft: '10px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          重置最高分
        </button>

        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '16px' }}>游戏速度:</span>
          <select
            value={gameState.speed}
            onChange={(e) => {
              setGameState(prev => ({
                ...prev,
                speed: Number(e.target.value)
              }));
            }}
            style={{
              padding: '5px 10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          >
            <option value="300">慢速</option>
            <option value="200">中速</option>
            <option value="100">快速</option>
            <option value="50">极速</option>
          </select>
        </div>

        {gameState.isGameOver && (
          <div style={{ 
            color: 'red',
            fontSize: '24px',
            marginTop: '20px',
            fontWeight: 'bold'
          }}>
            游戏结束!
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <p>使用方向键或WASD控制蛇的移动</p>
      </div>
    </div>
  );
};

export default GameBoard;