import { Buffer } from 'buffer';

// Polyfill Buffer for browser compatibility with Node.js libraries like gray-matter
(globalThis as any).Buffer = Buffer;
