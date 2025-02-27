import {describe, expect, it, vi} from 'vitest';
import {render, screen} from "@testing-library/react";
import Switch from "../switch.tsx";

describe('Switch Component', () => {
    it('renders without crashing', () => {
        const mockFn = vi.fn()
        render(<Switch checked={true} onChange={mockFn} />);
        expect(screen.getByRole('switch')).toBeInTheDocument()
    });
});
