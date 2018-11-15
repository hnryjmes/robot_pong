const Ball = require('../src/ball');

describe('Ball', () => {
  let stubContext;
  let stubCanvas;
  let ball;
  let PADDLEHEIGHT;

  beforeEach(() => {
    stubContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      closePath: jest.fn(),
    };
    stubCanvas = {
      getContext: jest.fn(() => stubContext),
    };
    ball = new Ball(stubCanvas);
    PADDLEHEIGHT = 10;
  });

  it('calls beginPath on ctx', () => {
    ball.draw();
    expect(stubContext.beginPath).toHaveBeenCalledTimes(1);
    expect(stubContext.arc).toHaveBeenCalledTimes(1);
    expect(stubContext.fill).toHaveBeenCalledTimes(1);
    expect(stubContext.closePath).toHaveBeenCalledTimes(1);
    expect(stubContext.fillStyle).toEqual('#FFFFFF');
  });

  it('should change position', () => {
    ball.moveBall();
    expect(ball.position).toEqual({ x: 452.2, y: 302 });
  });

  describe('Wall collision', () => {
    it('should not reverse vertical velocity, if ball does not hit wall', () => {
      ball.moveBall();
      expect(ball.velocity.dy).toEqual(2);
    });

    it('should reverse velocity, if ball hits bottom wall', () => {
      ball.position.y = 595;
      ball.moveBall();
      expect(ball.velocity.dy).toEqual(-2);
    });

    it('should reverse velocity, if ball hits top wall', () => {
      ball.position.y = 5;
      ball.velocity.dy = -2;
      ball.moveBall();
      expect(ball.velocity.dy).toEqual(2);
    });
  });

  describe('Paddle collision', () => {
    it('reverses the horizontal velocity', () => {
      expect(ball.velocity.dx).toEqual(2.2);
      ball.paddleCollision(12, PADDLEHEIGHT);
      expect(ball.velocity.dx).toEqual(-2.2);
    });

    it('changes the vertical velocity', () => {
      ball.position.y = 18;
      expect(ball.velocity.dy).toEqual(2);
      ball.paddleCollision(12, PADDLEHEIGHT);
      expect(ball.velocity.dy).toBeCloseTo(0.4, 1);
    });

    it('changes the vertical velocity in a different way', () => {
      ball.position.y = 18;
      expect(ball.velocity.dy).toEqual(2);
      ball.paddleCollision(16, PADDLEHEIGHT);
      expect(ball.velocity.dy).toEqual(-1.2);
    });
  });

  describe('Reset', () => {
    it('resets ball to start position', () => {
      ball.position = { x: 20, y: 50 };
      ball.reset();
      expect(ball.position).toEqual({ x: 450, y: 300 });
    });

    it('resets ball velocity', () => {
      ball.velocity = { dx: 20, dy: 50 };
      ball.reset();
      expect(ball.velocity).toEqual({ dx: 2, dy: 2 });
    });
  });
});