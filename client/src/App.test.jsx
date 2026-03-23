import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('renders app component without crashing', () => {
  renderWithRouter(<App />);
  // Just verify the app renders without errors
  const nav = screen.getByRole('navigation');
  expect(nav).toBeInTheDocument();
});
