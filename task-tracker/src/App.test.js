import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('loads tasks from the API endpoint', async () => {
  render(<App />);

  expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
  expect(await screen.findByText(/No tasks yet/i)).toBeInTheDocument();
});
