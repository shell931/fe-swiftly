/**
 * JIT Compiler Polyfill for dynamic component compilation
 * This ensures that the JIT compiler is available when Angular tries to compile components dynamically
 */

import '@angular/compiler';

// Ensure JIT compiler is available in the global scope
if (typeof (window as any).ng === 'undefined') {
  (window as any).ng = {};
}

// Polyfill for enabling JIT compilation in development
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Compiler, COMPILER_OPTIONS, CompilerFactory } from '@angular/core';

// Ensure the compiler is available
try {
  const platform = platformBrowserDynamic();
  if (!platform.injector.get(Compiler, null)) {
    console.warn('JIT compiler not available, attempting to provide it...');
  }
} catch (e) {
  console.warn('Could not initialize JIT compiler:', e);
}