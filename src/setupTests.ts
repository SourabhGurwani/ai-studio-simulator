// src/setupTests.ts
import '@testing-library/jest-dom';


// Mock window.URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn();