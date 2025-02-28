import {describe, expect, it, vi} from 'vitest';
import {render, screen, fireEvent} from "@testing-library/react";
import Switch from "../switch.tsx";

describe('Switch Component', () => {
    it('renders without crashing', () => {
        const mockFn = vi.fn()
        render(<Switch checked={true} onChange={mockFn} />);
        expect(screen.getByRole('switch')).toBeInTheDocument()
    });

    it('handles boolean checked prop correctly', () => {
        const mockFn = vi.fn();
        const {rerender} = render(<Switch checked={true} onChange={mockFn} />);

        const switchElement = screen.getByRole('switch');
        expect(switchElement.getAttribute('aria-checked')).toBe('true');

        rerender(<Switch checked={false} onChange={mockFn} />);
        expect(switchElement.getAttribute('aria-checked')).toBe('false');
    });

    it('handles numeric checked prop correctly', () => {
        const mockFn = vi.fn();
        const {rerender} = render(<Switch checked={1} onChange={mockFn} />);

        const switchElement = screen.getByRole('switch');
        expect(switchElement.getAttribute('aria-checked')).toBe('true');

        rerender(<Switch checked={0} onChange={mockFn} />);
        expect(switchElement.getAttribute('aria-checked')).toBe('false');
    });

    it('calls onChange handler when clicked', () => {
        const mockFn = vi.fn();
        render(<Switch checked={false} onChange={mockFn} />);

        fireEvent.click(screen.getByRole('switch'));
        expect(mockFn).toHaveBeenCalledWith(true);
    });

    it('has correct styling classes', () => {
        const mockFn = vi.fn();
        render(<Switch checked={true} onChange={mockFn} />);

        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveClass('bg-gray-200');
        expect(switchElement).toHaveClass('group');
        expect(switchElement).toHaveClass('inline-flex');
    });
});
