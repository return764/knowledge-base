import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input Component', () => {
    it('renders without crashing', () => {
        render(<Input />);
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    });
});
