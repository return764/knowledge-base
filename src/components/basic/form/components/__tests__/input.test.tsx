import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input Component', () => {
    it('renders without crashing', () => {
        render(<Input />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} />);
        
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '测试文本' } });
        expect(handleChange).toHaveBeenCalledWith('测试文本');
    });

    it('applies different sizes correctly', () => {
        const { rerender } = render(<Input size="small" />);
        expect(screen.getByRole('textbox')).toHaveClass('text-xs p-1.5');

        rerender(<Input size="default" />);
        expect(screen.getByRole('textbox')).toHaveClass('text-sm p-2');

        rerender(<Input size="large" />);
        expect(screen.getByRole('textbox')).toHaveClass('text-base p-3');
    });

    it('shows placeholder text', () => {
        const placeholder = '请输入...';
        render(<Input placeholder={placeholder} />);
        expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it('handles controlled value', () => {
        const value = '受控值';
        render(<Input value={value} />);
        expect(screen.getByRole('textbox')).toHaveValue(value);
    });

    it('handles empty value correctly', () => {
        render(<Input value={undefined} />);
        expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('preserves name attribute', () => {
        const name = 'test-input';
        render(<Input name={name} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('name', name);
    });

    it('handles undefined onChange', () => {
        render(<Input />);
        const input = screen.getByRole('textbox');
        
        // 确保不会抛出错误
        expect(() => {
            fireEvent.change(input, { target: { value: 'test' } });
        }).not.toThrow();
    });

    it('maintains focus state styling', () => {
        render(<Input />);
        const input = screen.getByRole('textbox');
        
        fireEvent.focus(input);
        expect(input).toHaveClass('focus:border-[#cfd0e8]');
        
        fireEvent.blur(input);
        expect(input).not.toHaveFocus();
    });
});
