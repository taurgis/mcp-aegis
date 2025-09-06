# ESLint Configuration

This project uses ESLint for code linting and formatting with a JavaScript-focused configuration.

## Available Scripts

- `npm run lint` - Lint all files in the project
- `npm run lint:fix` - Automatically fix linting issues where possible
- `npm run lint:src` - Lint only core source files (src/, test/, bin/)

## Configuration

The ESLint configuration is defined in `eslint.config.js` and includes:

### Code Quality Rules
- No unused variables (with underscore prefix exception for intentionally unused)
- Prefer const over let when possible
- No var declarations
- Use object shorthand and arrow functions
- Template literals preferred over string concatenation

### Formatting Rules
- Single quotes for strings
- 2-space indentation
- Unix line endings
- Trailing commas in multiline objects/arrays
- Semicolons required
- 120 character line length limit

### File-Specific Rules
- **Test files**: More lenient unused variable rules
- **Example files**: Warnings instead of errors for unused variables, allows case declarations
- **Bin/Script files**: Additional Node.js globals available

### Ignored Patterns
- node_modules/
- coverage/
- docs-site/
- temp-testing/
- dist/
- *.config.js files

## Integration

ESLint is configured to work with:
- ES2022 features
- ES modules (import/export)
- Node.js built-in test runner globals
- Common Node.js globals (setTimeout, process, etc.)

The configuration enforces consistent code style and catches potential issues while remaining flexible for different types of files in the project.
