import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '../Navbar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

it('toggles theme class on html element', () => {
  const { getByRole } = render(
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </ThemeProvider>
  );
  const button = getByRole('button', { name: /toggle theme/i });
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  fireEvent.click(button);
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});
