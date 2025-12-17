# Security Considerations: CapThat Chrome Extension

**Purpose**: Document security requirements and threat model for the CapThat Chrome Extension
**Created**: 2025-01-27
**Feature**: [spec.md](../spec.md)

## Security Threat Model

### Threat Categories

1. **Data Privacy & Confidentiality**
   - User browsing data (source URLs)
   - Captured images (potentially sensitive content)
   - Metadata (page titles, domains)

2. **Data Integrity**
   - Image content verification (content hash)
   - Storage corruption prevention
   - Export file integrity

3. **Extension Security**
   - Content script injection vulnerabilities
   - Cross-site scripting (XSS) risks
   - Permission scope abuse

4. **Storage Security**
   - Local storage data protection
   - Storage quota exhaustion attacks
   - Data persistence across sessions

5. **Network Security**
   - CORS policy handling
   - Local API communication (Phase 2)
   - Malicious URL/image sources

## Security Requirements

### 1. Manifest Permissions (Manifest V3)

**Requirement**: Extension MUST request minimal permissions necessary for functionality.

**Specific Permissions Needed**:
- `storage` - For chrome.storage.local (metadata)
- `activeTab` - For accessing current tab content (image detection/capture)
- `scripting` - For content script injection (Manifest V3)
- `sidePanel` (optional) - If using side panel UI

**Permissions to AVOID**:
- `*://*/*` (all URLs) - Use `activeTab` instead
- `tabs` - Only if absolutely necessary
- `downloads` - Use `chrome.downloads` API only if needed, or browser download via blob URLs

**Security Controls**:
- [ ] Review all requested permissions in manifest.json
- [ ] Use `activeTab` instead of broad host permissions
- [ ] Document justification for each permission
- [ ] Test with minimal permission set

### 2. Content Security Policy (CSP)

**Requirement**: Extension MUST implement strict Content Security Policy.

**CSP Requirements**:
- [ ] Block `eval()` and inline scripts
- [ ] Restrict `script-src` to extension scripts only
- [ ] Restrict `img-src` to `data:`, `blob:`, `https:`, and `http:` (for localhost)
- [ ] Restrict `connect-src` to necessary domains (localhost:3000 for Phase 2)
- [ ] Prevent inline event handlers
- [ ] Use nonce or hash for any required inline content

**Implementation**:
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'; img-src 'self' data: blob: https: http:; connect-src 'self' http://localhost:3000"
}
```

### 3. Content Script Injection Security

**Requirement**: Content scripts MUST be isolated from page context and prevent XSS.

**Security Controls**:
- [ ] Use isolated world for content scripts (default in Manifest V3)
- [ ] Never use `unsafeWindow` or direct page context access
- [ ] Validate all data passed between extension and page context
- [ ] Use `postMessage` for secure communication
- [ ] Sanitize any DOM manipulation to prevent XSS
- [ ] Avoid injecting user-controlled content into page DOM

**Risks**:
- XSS if page content is injected without sanitization
- DOM manipulation breaking page functionality
- Content script conflicts with page scripts

### 4. Data Storage Security

**Requirement**: Stored data MUST be protected and validated.

**Storage Security Controls**:
- [ ] Validate all data before storing in chrome.storage.local
- [ ] Sanitize URLs before storage (prevent javascript: or data: URLs if not intended)
- [ ] Implement storage quota monitoring (prevent DoS via storage exhaustion)
- [ ] Encrypt sensitive data if required (though local storage is already isolated)
- [ ] Validate data on retrieval (defense in depth)
- [ ] Handle storage errors gracefully without exposing internals

**Data Validation**:
- [ ] Image URLs: Validate scheme (http/https/data/blob), prevent javascript: URLs
- [ ] Source page URLs: Validate format, sanitize
- [ ] Timestamps: Validate format, prevent injection
- [ ] Metadata: Sanitize user-provided metadata (title, domain)

**Storage Limits**:
- [ ] Enforce 100-item board limit (already specified)
- [ ] Monitor chrome.storage.local quota (10MB default)
- [ ] Monitor IndexedDB quota (varies by browser)
- [ ] Provide clear error messages when quota exceeded

### 5. Image Content Security

**Requirement**: Image capture MUST validate and sanitize image sources.

**Security Controls**:
- [ ] Validate image URLs before fetching
- [ ] Prevent javascript: URLs in image sources
- [ ] Validate image MIME types (JPEG, PNG, GIF, WebP)
- [ ] Implement size limits for image blobs (prevent memory exhaustion)
- [ ] Validate content hash matches expected format
- [ ] Handle malicious or corrupted image data gracefully

**Content Hash Security**:
- [ ] Use cryptographically secure hash (SHA-256) for content matching
- [ ] Validate hash format before comparison
- [ ] Prevent hash collision attacks (though unlikely with SHA-256)

**Image Size Limits**:
- [ ] Define maximum image dimensions (e.g., 10MP)
- [ ] Define maximum file size (e.g., 10MB per image)
- [ ] Reject or resize oversized images
- [ ] Prevent memory exhaustion from large images

### 6. CORS and Cross-Origin Security

**Requirement**: Extension MUST handle CORS securely without bypassing browser security.

**Security Controls**:
- [ ] Respect CORS policies (do not attempt to bypass)
- [ ] Use extension's privileged context only when necessary
- [ ] Validate all fetched resources
- [ ] Handle CORS failures gracefully (fallback mechanisms)
- [ ] Do not expose extension capabilities to web pages

**Fallback Security**:
- [ ] Tab capture fallback (Phase 2) requires `tabs` permission - document justification
- [ ] Validate captured tab content before storage
- [ ] Inform users when fallback is used (already specified)

### 7. Export Security

**Requirement**: Export functionality MUST generate safe, validated files.

**Security Controls**:
- [ ] Sanitize filenames (prevent path traversal: `../`, `/`, etc.)
- [ ] Validate exported JSON structure (prevent injection)
- [ ] Limit ZIP file size (prevent DoS)
- [ ] Validate image data before including in ZIP
- [ ] Use safe MIME types for downloads
- [ ] Prevent filename collisions

**Filename Sanitization**:
- [ ] Remove or escape special characters: `/`, `\`, `..`, `:`, `*`, `?`, `"`, `<`, `>`, `|`
- [ ] Limit filename length
- [ ] Use safe timestamp format (no special chars)
- [ ] Validate exported filenames match pattern: `cap-<timestamp>-<id>.png`

**JSON Export Security**:
- [ ] Validate JSON structure (no circular refs - already specified)
- [ ] Sanitize URLs in JSON (prevent javascript: URLs)
- [ ] Validate UTF-8 encoding (already specified)
- [ ] Limit JSON size

### 8. Local API Communication (Phase 2)

**Requirement**: Communication with local Next.js API MUST be secure.

**Security Controls**:
- [ ] Only communicate with localhost:3000 (not remote servers)
- [ ] Validate API responses before processing
- [ ] Handle API failures gracefully (fallback to extension storage)
- [ ] Do not expose extension storage to API
- [ ] Validate payload structure before sending
- [ ] Implement timeout for API requests

**API Security**:
- [ ] Verify localhost origin (prevent SSRF if API is compromised)
- [ ] Validate response format
- [ ] Handle authentication if API requires it (future consideration)
- [ ] Log API communication errors (for debugging, not user data)

### 9. Input Validation and Sanitization

**Requirement**: All user inputs and external data MUST be validated.

**Validation Points**:
- [ ] Image URLs (scheme, format)
- [ ] Source page URLs
- [ ] Metadata fields (title, domain, product links)
- [ ] Timestamps
- [ ] Content hashes
- [ ] Export filenames
- [ ] Storage data on retrieval

**Sanitization**:
- [ ] HTML entities in metadata (if displayed)
- [ ] URL encoding/decoding
- [ ] Filename sanitization
- [ ] JSON structure validation

### 10. Error Handling Security

**Requirement**: Error messages MUST not expose sensitive information.

**Security Controls**:
- [ ] Do not expose internal file paths in errors
- [ ] Do not expose storage structure in errors
- [ ] Do not expose extension internals in console (production)
- [ ] Provide user-friendly error messages
- [ ] Log detailed errors server-side (if applicable) or in extension logs only
- [ ] Do not expose user data in error messages

### 11. Extension Isolation

**Requirement**: Extension context MUST remain isolated from page context.

**Security Controls**:
- [ ] Never expose extension APIs to page scripts
- [ ] Use message passing for communication
- [ ] Validate all messages between contexts
- [ ] Use `chrome.runtime.sendMessage` with validation
- [ ] Prevent page scripts from accessing extension storage

### 12. Data Privacy

**Requirement**: User data MUST be handled with privacy considerations.

**Privacy Controls**:
- [ ] Store data locally only (no remote transmission except Phase 2 localhost)
- [ ] Clear data on extension uninstall (if desired)
- [ ] Provide clear data retention policy
- [ ] Do not track user behavior beyond necessary functionality
- [ ] Do not share data with third parties
- [ ] Inform users about data storage (in privacy policy/README)

**Data Minimization**:
- [ ] Store only necessary data (URL, timestamp, image reference)
- [ ] Do not store full page content
- [ ] Do not store user browsing history beyond captured items

### 13. Update and Distribution Security

**Requirement**: Extension updates MUST be secure.

**Security Controls**:
- [ ] Sign extension for Chrome Web Store distribution
- [ ] Validate extension integrity on update
- [ ] Use HTTPS for any remote resources (if added)
- [ ] Implement update mechanism securely
- [ ] Test updates do not break existing data

## Security Testing Requirements

### Testing Checklist

- [ ] Test with minimal permissions
- [ ] Test CSP violations are blocked
- [ ] Test XSS prevention in content scripts
- [ ] Test input validation (malicious URLs, oversized images)
- [ ] Test storage quota handling
- [ ] Test CORS handling
- [ ] Test export file security (filename sanitization, JSON validation)
- [ ] Test error message security (no sensitive data exposure)
- [ ] Test extension isolation (page scripts cannot access extension)
- [ ] Test data persistence and cleanup

## Compliance Considerations

### GDPR (if applicable)
- [ ] Data is stored locally (user's device)
- [ ] No personal data collection beyond user's explicit captures
- [ ] User can clear all data (Clear Board functionality)
- [ ] Extension uninstall removes data (browser default behavior)

### Chrome Web Store Policies
- [ ] Single purpose (image capture and management)
- [ ] Minimal permissions
- [ ] Privacy policy (if required)
- [ ] User data handling disclosure

## Security Best Practices

1. **Principle of Least Privilege**: Request only necessary permissions
2. **Defense in Depth**: Validate at multiple layers
3. **Fail Securely**: Handle errors without exposing internals
4. **Input Validation**: Validate all external inputs
5. **Output Encoding**: Sanitize data before display
6. **Secure Communication**: Use secure channels (HTTPS, validated localhost)
7. **Regular Updates**: Keep dependencies updated
8. **Security Reviews**: Review code for security issues

## Open Questions / Future Considerations

- [ ] Should images be encrypted at rest? (Currently stored in IndexedDB, isolated by browser)
- [ ] Should there be authentication for Phase 2 local API? (Currently localhost only)
- [ ] Should there be rate limiting on capture actions? (Currently 100-item limit)
- [ ] Should there be audit logging of user actions? (Privacy vs. security tradeoff)
- [ ] Should extension support encrypted exports? (Future enhancement)

## References

- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Manifest V3 Security](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/)
- [Content Security Policy](https://developer.chrome.com/docs/extensions/mv3/content_security_policy/)
- [Chrome Extension Permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)

