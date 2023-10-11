import { render, screen } from '@testing-library/react';
import sale from './seller_info';

test('renders learn react link', () => {
  render(<Sale />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});