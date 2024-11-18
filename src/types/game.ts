export interface Position {
    x: number;
    y: number;
  }
  
  export interface GameState {
    snake: Position[];
    food: Position;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    isGameOver: boolean;
    score: number;
    highScore: number;
  }