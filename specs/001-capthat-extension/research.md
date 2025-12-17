# Research: CapThat Chrome Extension

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Status**: Complete

## Research Findings

### Chrome Extension Message Passing (MV3)

**Decision**: Use `chrome.runtime.sendMessage` and `chrome.runtime.onMessage` for bidirectional communication between content scripts and service worker.

**Rationale**: 
- Standard Chrome Extension API for MV3
- Supports async responses via `sendResponse` callback
- Type-safe with TypeScript interfaces
- Isolated world communication pattern

**Alternatives considered**:
- `chrome.runtime.connect` (long-lived connections) - More complex, not needed for request/response pattern
- `postMessage` with window - Not secure, breaks isolation
- Custom event system - Unnecessary complexity

**Implementation Pattern**:
```typescript
// Content script → Service worker
chrome.runtime.sendMessage({ type: 'CAPTURE_REQUEST', payload: {...} }, (response) => {
  // Handle response
});

// Service worker → Content script
chrome.tabs.sendMessage(tabId, { type: 'UPDATE_UI', payload: {...} });
```

### Message Type Structure

**Decision**: Use discriminated union pattern with `type` field for message routing.

**Rationale**:
- TypeScript type narrowing works automatically
- Easy to validate and route messages
- Clear message intent
- Prevents invalid message shapes

**Alternatives considered**:
- Separate message classes - More verbose, unnecessary OOP
- String-based routing - Less type-safe
- Protocol buffers - Overkill for internal extension communication

### Storage Strategy

**Decision**: Use chrome.storage.local for metadata, IndexedDB for blobs.

**Rationale**:
- chrome.storage.local: 10MB quota, synchronous API, good for small metadata
- IndexedDB: Larger quota, async API, better for binary data (blobs)
- Separation of concerns: metadata vs. binary data

**Alternatives considered**:
- All in chrome.storage.local - Limited by 10MB quota, inefficient for blobs
- All in IndexedDB - More complex API, overkill for small metadata
- File System API - Not available in extensions

### CORS Handling Strategy

**Decision**: Multi-tier fallback: URL storage → blob fetch → tab capture (v2).

**Rationale**:
- URL storage always works (no CORS restrictions)
- Blob fetch works for same-origin and CORS-enabled images
- Tab capture provides fallback for CORS-blocked images (Phase 2)

**Alternatives considered**:
- Only URL storage - Limited functionality, no offline access
- Only blob fetch - Fails on many websites due to CORS
- Proxy server - Requires backend infrastructure, not local-first

### Export Filename Sanitization

**Decision**: Remove path traversal characters (`/`, `\`, `..`, etc.) and limit length.

**Rationale**:
- Prevents path traversal attacks
- Ensures cross-platform compatibility
- Prevents filesystem errors

**Alternatives considered**:
- Allow all characters - Security risk
- Base64 encoding - Less user-friendly filenames
- UUID-only names - Less descriptive

## Technology Decisions

### TypeScript for Type Safety

**Decision**: Use TypeScript for all extension code.

**Rationale**:
- Type safety prevents runtime errors
- Better IDE support
- Self-documenting code via types
- Easier refactoring

### React for UI Components

**Decision**: Use React for side panel UI.

**Rationale**:
- Component reusability
- State management
- Consistent with Next.js app (Phase 2)
- Good ecosystem support

### Tailwind CSS for Styling

**Decision**: Use Tailwind CSS only (no external UI libraries).

**Rationale**:
- Utility-first approach
- No runtime CSS-in-JS overhead
- Consistent design system
- Matches project requirements

### Vite for Extension Bundling

**Decision**: Use Vite for extension build process.

**Rationale**:
- Fast builds
- Good TypeScript support
- Plugin ecosystem
- Already configured in project

## Best Practices Adopted

1. **Message Validation**: All messages validated at service worker boundary
2. **Error Handling**: User-friendly error messages, no internal path exposure
3. **Storage Quota Monitoring**: Warn at 80% usage, enforce limits
4. **Security**: Strict CSP, minimal permissions, input validation
5. **Performance**: Virtual scrolling for large lists, lazy loading where appropriate

## Open Questions Resolved

- ✅ Message passing pattern: chrome.runtime.sendMessage
- ✅ Storage strategy: chrome.storage.local + IndexedDB
- ✅ CORS handling: Multi-tier fallback
- ✅ Type structure: Discriminated union with `type` field
- ✅ Filename sanitization: Remove path traversal chars

## References

- Chrome Extension MV3 Documentation: https://developer.chrome.com/docs/extensions/mv3/
- Chrome Extension Message Passing: https://developer.chrome.com/docs/extensions/mv3/messaging/
- IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- chrome.storage API: https://developer.chrome.com/docs/extensions/reference/storage/

