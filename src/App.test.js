import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const comingSoon = screen.getByText(/COMING SOON/i);
  expect(comingSoon).toBeInTheDocument();
});
