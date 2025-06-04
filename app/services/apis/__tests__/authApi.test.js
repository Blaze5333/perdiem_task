/*eslint-disable*/
import { loginWithEmailPassword } from '../authApi';
import client from '../../../client';

// Mock axios client
jest.mock('../../../client', () => ({
  post: jest.fn(),
}));

describe('authApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('loginWithEmailPassword', () => {
    it('should handle successful login', async () => {
      // Mock successful response
      client.post.mockResolvedValueOnce({
        status: 200,
        data: {
          user: {
            name: 'Test User',
            email: 'test@example.com',
            id: '123',
            photo: 'https://example.com/photo.jpg',
          },
          token: 'test-token',
          message: 'Login successful',
        },
      });

      const result = await loginWithEmailPassword('test@example.com', 'password123');

      expect(client.post).toHaveBeenCalledWith('auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        user: {
          name: 'Test User',
          email: 'test@example.com',
          userId: '123',
          photo: 'https://example.com/photo.jpg',
        },
        token: 'test-token',
        message: 'Login successful',
      });
    });

    it('should handle 403 forbidden error', async () => {
      // Mock 403 error response
      client.post.mockRejectedValueOnce({
        response: {
          status: 403,
          data: {
            message: 'Access denied',
          },
        },
      });

      await expect(loginWithEmailPassword('test@example.com', 'password123')).rejects.toThrow(
        'Access denied. You may not have permission to log in.'
      );
    });

    // Add more test cases for other error conditions if needed
  });
});
