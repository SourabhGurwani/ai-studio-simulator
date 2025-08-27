// src/components/__tests__/LoadingSpinner.test.tsx
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByTestId('spinner-element')).toHaveClass('w-4 h-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByTestId('spinner-element')).toHaveClass('w-8 h-8');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByTestId('spinner-element')).toHaveClass('w-12 h-12');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-class');
  });
});