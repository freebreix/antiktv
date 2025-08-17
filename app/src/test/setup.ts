import { vi } from 'vitest';

// Mock SvelteKit environment modules
vi.mock('$env/dynamic/private', () => ({
  env: {
    ANTIK_EMAIL: 'test@example.com',
    ANTIK_PASSWORD: 'testpassword',
    ANTIK_DEVICE_ID: 'TestDevice123',
    ANTIK_REGION: 'SK'
  }
}));

// Setup global fetch mock
global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
