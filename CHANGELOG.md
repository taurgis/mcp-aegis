# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Error boundary and test page functionality
- Comprehensive YAML testing guide page
- AI agent support documentation
- Real-world testing examples
- Installation page with detailed setup instructions
- Favicons and web manifest for better PWA support
- Method-based query execution support
- Donation banner and GitHub links in sidebar

### Changed
- **BREAKING**: Project renamed from "MCP Conductor" to "MCP Aegis"
- Removed Conductor CLI entry point (now uses `aegis` command)
- Migrated documentation site to Vite React SSG
- Enhanced documentation site appearance and layout
- Improved home page layout and content
- Updated React and related dependencies
- Streamlined UI components styling
- Enhanced SEO with better page anchors and canonical URLs

### Fixed
- Enhanced error handling and recovery mechanisms
- Improved TOC generation and sitemap updates
- Fixed SSR mismatch issues in code blocks and components
- Better CodeTabs SSR consistency
- Resolved internal link navigation with hash fragments
- Enhanced pattern validation and reporting
- Prevented SSR mismatches across multiple components
- Improved hydration warning suppression

### Documentation
- Complete restructuring of testing guide
- Enhanced pattern matching documentation with examples
- Updated quick start guide for better onboarding
- Added comprehensive AI agent testing documentation
- Improved programmatic testing guide
- Added advanced CLI options documentation

### Maintenance
- Updated Vite dependency for better performance
- Migrated to vite-react-ssg Head component
- Enhanced CLI argument parsing
- Improved version retrieval mechanisms
- Added hydration warning suppression for cleaner development

## [1.0.16] - 2025-09-17

### Added
- Support for string length validation patterns
- Method-based query execution functionality
- Enhanced test coverage and validation
- MCP Conductor integration for LLMs

### Fixed
- Fixed fragmentation in test execution
- Improved test isolation for failure scenarios
- Enhanced cross-field validation in failure tests
- Better field extraction failure test handling
- Refined stderr validation in failure tests
- Improved partial matching failure tests
- Enhanced negation pattern test failures
- Better type pattern test failure handling

### Documentation
- Updated node agents documentation
- Fixed markdown formatting issues

### Testing
- Added comprehensive failing test suites for better validation
- Improved pattern validation error messages
- Enhanced string pattern failure diagnostics
- Better array and field test suite coverage

## [1.0.15] - 2025-09-16

### Testing
- Improved failure test isolation for more reliable testing
- Enhanced cross-field validation failure tests
- Better field extraction failure test handling
- Refined stderr validation in failure tests
- Improved partial matching failure tests
- Enhanced failing negation pattern tests
- Added comprehensive failing type pattern tests
- Increased test coverage across multiple modules

### Maintenance
- Work in progress improvements and optimizations
- Fixed test execution issues

## [1.0.14] - 2025-09-15

### Added
- Concise output option for cleaner test reports
- Cross-field validation pattern matching
- Enhanced debugging options for test runs
- Comprehensive error reporting and grouping
- Cross-field pattern matching capabilities
- Syntax analyzer for YAML patterns and test engine
- Enhanced numeric pattern matching support
- Operator error analysis and corrections
- Regex correction module for better validation
- Type error correction logic

### Fixed
- Improved pattern validation messages and error reporting
- Reduced noise in validation error reports
- Enhanced arrayContains validation messages
- Fixed partial validation logic issues
- Better pattern matching debugging capabilities

### Testing
- Added failing date pattern tests for comprehensive validation
- Enhanced string pattern failure diagnostics
- Improved failing array/field test suites
- Added comprehensive tests for shared modules
- Enhanced pattern naming tests
- Improved test coverage and analyzer functionality

### Documentation
- Added YAML testing guide for AI agents
- Comprehensive AI agent instructions
- Performance testing documentation
- YAML/Regex troubleshooting tips
- Error reporting options documentation
- Pattern matching documentation updates
- Partial array elements pattern documentation

### Maintenance
- Refactored test engine for better modularity
- Enhanced reporter module structure
- Modularized test reporter components
- Refactored correction modules for better organization

## [1.0.13] - 2025-09-14

### Added
- Enhanced test suite and CLI options
- Improved test validation and reporting capabilities
- Extended pattern matching functionality
- Date pattern matching tests for comprehensive validation

### Fixed
- Enhanced pattern validation and error reporting
- Improved test suite organization and structure

### Documentation
- Updated MCP Conductor documentation
- Added error reporting documentation

### Testing
- Added comprehensive date pattern matching tests
- Enhanced test validation across multiple scenarios

## [1.0.11] - 2025-09-13

### Added
- Enhanced test validation and reporting
- Extended pattern matching capabilities with new features

### Fixed
- Prevented message handling race conditions
- Improved test reliability by clearing buffers properly

### Features
- Interactive query command for better debugging
- Enhanced CLI argument parsing
- Query command for tool debugging
- Extended field extraction syntax

### Maintenance
- Improved version retrieval mechanisms
- Enhanced documentation site naming

## [1.0.10] - 2025-09-12

### Added
- Interactive query command functionality
- Enhanced CLI argument parsing capabilities
- Pattern negation support (match:not: prefix)
- Enhanced arrayContains pattern matching

### Fixed
- Prevented message handling race conditions
- Improved test reliability through better buffer management

### Features
- Query command for tool debugging and interaction
- Enhanced field extraction syntax support

### Documentation
- Improved programmatic testing guide
- Updated documentation site naming conventions

### Maintenance
- Improved version retrieval mechanisms
- Enhanced ready pattern handling

## [1.0.8] - 2025-09-11

### Added
- Interactive query command for tool debugging
- Enhanced arrayContains pattern matching capabilities

### Fixed
- Improved test reliability by clearing buffers properly
- Prevented message handling race conditions

### Features
- Tool debugging command interface
- Enhanced pattern matching for arrays

### Maintenance
- Better buffer management in test execution
- Improved code readability and structure

## [1.0.7] - 2025-09-10

### Added
- Query command for tool debugging and interaction
- Enhanced test execution and validation capabilities

### Documentation
- Clarified multiline regex usage in documentation
- Improved code block and page navigation
- Enhanced mobile responsiveness

### Features
- Tool debugging command interface
- Enhanced field extraction syntax
- Regex pattern documentation

### Maintenance
- Improved code block and layout styling
- Better documentation list styling
- Restructured agent guides for clarity

## [1.0.5] - 2025-09-09

### Added
- Query command for interactive tool debugging
- Enhanced test execution and validation

### Maintenance
- Enhanced CLI argument parsing
- Improved documentation site functionality

## [1.0.4] - 2025-09-08

### Fixed
- Duplicate information issues
- Enhanced documentation and examples

### Testing
- Added more complex YAML test examples
- Improved test suite coverage

## [1.0.3] - 2025-09-07

### Added
- More complex YAML tests as examples
- Enhanced testing capabilities

### Documentation
- Updated documentation based on latest examples
- Improved pattern matching examples

## [1.0.2] - 2025-09-06

### Added
- Enhanced functionality and features
- Improved testing capabilities

### Fixed
- Memory leak in YAML tests
- Maximum listeners exceeded issues

### Features
- Fallback configuration support
- More CLI options including verbose, debugging, timing
- Enhanced documentation and AI agent support

### Documentation
- Migrated documentation site to React/Vite
- Added comprehensive docs site v2
- Improved AI documentation

### Maintenance
- Dependency updates for better performance
- Refactored structure for improved modularity

## [1.0.1] - 2025-09-05

### Added
- Init script functionality
- Enhanced binary command support

### Features
- Added mcp-conductor binary command
- Improved command-line interface

### Maintenance
- Enhanced project structure and organization

## [1.0.0] - 2025-09-04

### Added
- Initial release of MCP Conductor
- Core MCP testing library functionality
- Conductor CLI binary
- Basic YAML testing support
- Programmatic testing API

### Features
- JSON-RPC 2.0 communication with MCP servers
- Pattern matching for test validation
- Configuration-based server management
- Basic documentation and examples

---

## Version History

- **1.0.16** (2025-09-17) - Latest stable release with enhanced testing capabilities
- **Previous versions** - Historical releases focused on core MCP testing functionality

## Migration Guide

### From MCP Conductor to MCP Aegis

If you're upgrading from the old "MCP Conductor" naming:

1. Update your CLI commands from `mcp-conductor` to `aegis`
2. Update any configuration references to use the new project name
3. The core functionality remains the same - only the naming has changed

### Dependencies

- Node.js 16+ required
- Updated React dependencies for documentation site
- Vite-based build system for improved performance

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.