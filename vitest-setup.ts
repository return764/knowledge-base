import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom';


global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};


afterEach(() => {
    cleanup();
});
