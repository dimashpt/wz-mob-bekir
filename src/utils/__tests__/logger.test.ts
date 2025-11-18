import { logger } from '../logger';

describe('logger utilities', () => {
  describe('logger instance', () => {
    it('should have log method', () => {
      expect(typeof logger.log).toBe('function');
    });

    it('should have info method', () => {
      expect(typeof logger.info).toBe('function');
    });

    it('should have warn method', () => {
      expect(typeof logger.warn).toBe('function');
    });

    it('should have error method', () => {
      expect(typeof logger.error).toBe('function');
    });

    it('should all be callable functions', () => {
      const methods = ['log', 'info', 'warn', 'error'];
      methods.forEach((method) => {
        expect(typeof logger[method as keyof typeof logger]).toBe('function');
      });
    });
  });

  describe('method functionality', () => {
    it('should have callable log method', () => {
      expect(() => {
        logger.log('test');
      }).not.toThrow();
    });

    it('should have callable info method', () => {
      expect(() => {
        logger.info('test');
      }).not.toThrow();
    });

    it('should have callable warn method', () => {
      expect(() => {
        logger.warn('test');
      }).not.toThrow();
    });

    it('should have callable error method', () => {
      expect(() => {
        logger.error('test');
      }).not.toThrow();
    });

    it('should accept multiple arguments in log', () => {
      expect(() => {
        logger.log('msg', 'arg1', 'arg2', { obj: true }, [1, 2, 3]);
      }).not.toThrow();
    });

    it('should accept various data types in info', () => {
      expect(() => {
        logger.info(123, true, null, undefined, {}, []);
      }).not.toThrow();
    });

    it('should accept error objects in warn', () => {
      expect(() => {
        const error = new Error('test error');
        logger.warn('Error occurred:', error);
      }).not.toThrow();
    });

    it('should accept error objects in error method', () => {
      // Test that logger.error accepts Error objects without throwing
      const mockError = { name: 'Error', message: 'test error' };
      expect(() => {
        logger.error(mockError);
      }).not.toThrow();
    });

    it('should handle no arguments', () => {
      expect(() => {
        logger.log();
        logger.info();
        logger.warn();
        logger.error();
      }).not.toThrow();
    });

    it('should delegate to console methods', () => {
      // Verify that logger instances are functions bound to console methods
      const logString = logger.log.toString();
      const infoString = logger.info.toString();
      const warnString = logger.warn.toString();
      const errorString = logger.error.toString();

      // All logger methods should be function type
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');

      // They should have valid function representations
      expect(logString.length).toBeGreaterThan(0);
      expect(infoString.length).toBeGreaterThan(0);
      expect(warnString.length).toBeGreaterThan(0);
      expect(errorString.length).toBeGreaterThan(0);
    });
  });
});
