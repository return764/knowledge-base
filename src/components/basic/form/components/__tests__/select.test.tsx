import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from '../select';
import {mockAnimationsApi} from "jsdom-testing-mocks";

mockAnimationsApi()

describe('Select Component', () => {

    const defaultProps = {
        options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
            { label: '选项3', value: '3' }
        ],
        onChange: vi.fn()
    };

    it('renders without crashing', () => {
        render(<Select {...defaultProps} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows label when provided', () => {
        const label = '测试标签';
        render(<Select {...defaultProps} label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('selects first option by default when defaultFirst is true', () => {
        render(<Select {...defaultProps} defaultFirst={true} />);
        expect(screen.getByText(defaultProps.options[0].label)).toBeInTheDocument();
        expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
    });

    it('opens options list when clicked', async () => {
        render(<Select {...defaultProps} defaultFirst={false}/>);
        fireEvent.click(screen.getByRole('button'));

        defaultProps.options.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });
    });

    it('calls onChange when option is selected', () => {
        render(<Select {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText(defaultProps.options[1].label));
        expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.options[1].value);
    });

    it('displays selected value', () => {
        const selectedValue = '2';
        render(<Select {...defaultProps} value={selectedValue} />);
        expect(screen.getByText(defaultProps.options[1].label)).toBeInTheDocument();
    });

    it('handles empty options array', () => {
        render(<Select options={[]} onChange={() => {}} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles undefined value', () => {
        render(<Select {...defaultProps} value={undefined} defaultFirst={false}/>);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('');
    });

    it('applies correct styling', () => {
        render(<Select {...defaultProps} />);
        const button = screen.getByRole('button');

        expect(button).toHaveClass('rounded-md');
        expect(button).toHaveClass('bg-white');
        expect(button).toHaveClass('ring-1');
        expect(button).toHaveClass('ring-inset');
        expect(button).toHaveClass('ring-gray-300');
    });

    it('updates selection when value prop changes', () => {
        const { rerender } = render(<Select {...defaultProps} value="1" />);
        expect(screen.getByText(defaultProps.options[0].label)).toBeInTheDocument();

        rerender(<Select {...defaultProps} value="2" />);
        expect(screen.getByText(defaultProps.options[1].label)).toBeInTheDocument();
    });

    it('maintains selected value when options change', () => {
        const { rerender } = render(<Select {...defaultProps} value="2" />);
        expect(screen.getByText(defaultProps.options[1].label)).toBeInTheDocument();

        const newOptions = [
            { label: '新选项1', value: '1' },
            { label: '新选项2', value: '2' },
            { label: '新选项3', value: '3' }
        ];

        rerender(<Select options={newOptions} value="2" onChange={defaultProps.onChange} />);
        expect(screen.getByText('新选项2')).toBeInTheDocument();
    });

    it('handles click outside to close options', async () => {
        render(<Select {...defaultProps} defaultFirst={false}/>);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        defaultProps.options.forEach(option => {
            expect(screen.getByText(option.label)).toBeInTheDocument();
        });

        fireEvent.click(button);

        await waitFor(() => {
            defaultProps.options.forEach(option => {
                expect(screen.queryByText(option.label)).not.toBeInTheDocument();
            });
        })
    });
});
