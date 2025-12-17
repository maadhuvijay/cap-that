<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (initial constitution)
Modified principles: N/A (new constitution)
Added sections: Core Principles (4 principles), Development Guidelines, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligns with new principles
  ✅ spec-template.md - No changes needed (generic template)
  ✅ tasks-template.md - No changes needed (generic template)
Follow-up TODOs: None
-->

# Cap That Constitution

## Core Principles

### I. Code Clarity and Readability
Code MUST be clean, easy-to-read, and immediately understandable. Use descriptive variable and function names. Structure code logically with clear flow. Avoid clever or cryptic implementations that require deep domain knowledge to understand. When in doubt, prefer explicit over implicit.

**Rationale**: Code is read far more often than it is written. Clear code reduces cognitive load, speeds up onboarding, and minimizes bugs from misunderstandings.

### II. Simplicity First
Prioritize simple solutions over complex ones. Avoid premature optimization and over-engineering. Choose the most straightforward approach that solves the problem. Complexity MUST be justified when introduced.

**Rationale**: Simple code is easier to understand, maintain, and debug. Newcomers to full-stack development can learn and contribute more effectively when complexity is minimized.

### III. Regular Documentation Through Comments
Code MUST include regular comments that explain the "why" behind decisions, not just the "what". Comment complex logic, non-obvious business rules, and architectural decisions. Assume readers are relative newcomers to full-stack development who may not be familiar with framework-specific patterns or domain concepts.

**Rationale**: Comments serve as inline documentation that helps newcomers understand both the code and the reasoning behind it. This accelerates learning and reduces the need for external documentation.

### IV. File Organization: Prefer Single Files
Where possible, avoid creating excessive files. Rely on single files as much as possible. Consolidate related functionality into cohesive modules rather than splitting into many small files. Only create separate files when there is a clear benefit (e.g., very large files, distinct concerns that would be confusing together, or shared utilities used across multiple features).

**Rationale**: Fewer files mean less navigation overhead and easier mental mapping of the codebase. Newcomers can understand a feature by reading a single file rather than jumping between many small files. This reduces cognitive overhead and makes the project structure more approachable.

## Development Guidelines

### Code Style
- Use consistent formatting (enforced by project linting/formatting tools)
- Prefer functional components and hooks in React/Next.js
- Keep functions focused and single-purpose
- Extract complex logic into well-named helper functions within the same file when possible

### Comment Guidelines
- Add comments for:
  - Business logic that isn't immediately obvious
  - Framework-specific patterns that newcomers might not recognize
  - Non-standard approaches or workarounds
  - Complex algorithms or data transformations
- Avoid comments that simply restate what the code does
- Use JSDoc-style comments for exported functions and components

### File Organization Guidelines
- Default to keeping related code in a single file
- Split files only when:
  - A file exceeds ~500 lines and contains distinct, separable concerns
  - Code is shared across multiple features (create shared utilities)
  - Separation provides clear architectural benefit (e.g., API routes vs. UI components)
- Prefer feature-based organization over layer-based when possible

## Governance

This constitution supersedes all other coding practices and style guides. All code reviews MUST verify compliance with these principles.

**Amendment Procedure**: 
- Amendments require documentation of the rationale
- Version must be incremented according to semantic versioning
- All dependent templates and documentation must be updated to reflect changes

**Compliance Review**:
- Code reviews must check adherence to all principles
- Violations must be justified in the Complexity Tracking section of implementation plans
- Regular reviews ensure the codebase remains accessible to newcomers

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
