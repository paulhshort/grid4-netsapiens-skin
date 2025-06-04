# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NetSapiens Portal Development project for Grid4 Communications, focused on customizing and developing portal solutions for the NetSapiens VoIP platform. The project contains default NetSapiens portal code, extensive documentation, and custom examples for portal branding and functionality enhancement.

## Project Structure

### Core Components

- **`default-netsapiens-portals/`** - Complete NetSapiens Manager Portal codebase (CakePHP-based)
  - Built on CakePHP 1.3.x framework with MVC architecture
  - Entry point: `webroot/index.php`
  - Configuration: `config/` directory contains all system configs
  - Models: `models/` with extensive VoIP-specific entities (users, domains, calls, queues, etc.)
  - Controllers: `controllers/` handling portal functionality (agents, calls, conferences, etc.)
  - Views: `views/` with CakePHP templates (.ctp files)

- **`netsapiens_organized_documentation/`** - 126 organized NetSapiens KB articles
  - Categorized into 10 logical folders (Call Center, Security, Portal Admin, etc.)
  - Contains Grid4-specific training materials and migration guides
  - Primary reference for NetSapiens platform capabilities

- **`NetsapiensSeanExampleJSandCSS/`** - Working examples of portal customization
  - `custom.css` - CSS overrides for portal styling
  - `sean.js` - JavaScript for adding custom toolbar links and functionality

### Key Architecture Elements

**NetSapiens Portal (CakePHP 1.3.x)**
- **Models**: Domain-driven with extensive VoIP entities (call queues, agents, conferences, users, phones)
- **Data Sources**: Separate abstraction layer in `models/datasources/` for external API integration
- **UI Configuration**: Extensive configuration system through `uiconfig` models
- **Multi-language**: Built-in i18n support with locale files
- **Vendors**: Includes Composer autoloader, ReactJS integration, phone number parsing

**Customization Architecture**
- **CSS/JS Injection**: Portal supports custom CSS/JS via configuration parameters
  - `PORTAL_CSS_CUSTOM` - URL/path to custom CSS file
  - `PORTAL_EXTRA_JS` - URL/path to custom JavaScript file
- **UI Parameters**: Extensive configuration through UI config system
- **Branding**: System-level and FQDN-level image branding capabilities

## Development Workflows

### Portal Customization

1. **CSS/JS Injection Method** (Recommended for branding)
   - Create custom CSS/JS files (examples in `NetsapiensSeanExampleJSandCSS/`)
   - Configure `PORTAL_CSS_CUSTOM` and `PORTAL_EXTRA_JS` parameters
   - Test changes using browser developer tools first

2. **Direct Code Modification** (For extensive changes)
   - Modify CakePHP views in `default-netsapiens-portals/views/`
   - Update controllers in `default-netsapiens-portals/controllers/`
   - Follow CakePHP 1.3.x conventions

### Configuration Management

**UI Configuration Parameters**
- Managed through `uiconfig` and `uiconfigdef` models
- Can be modified via Admin UI or Manager Portal
- Reference documentation in `netsapiens_organized_documentation/03_Portal_Administration_Configuration/`

**System Configuration**
- Core configs in `config/nsconfig.php` and related files
- Bootstrap configuration in `config/bootstrap.php`
- Database configuration in `config/database.php`

### Testing Portal Changes

1. **CSS/JS Testing**
   - Use browser developer tools to test changes live
   - Inspect elements to find CSS classes and IDs
   - NetSapiens portal uses Bootstrap framework classes

2. **Functionality Testing**
   - Test in development environment first
   - Validate with different user roles (admin, agent, user)
   - Check multi-language functionality if applicable

## Important References

### API Integration
- NetSapiens V2 API: Reference in `Netsapiens V2 API Reference/NSv2API_swagger.json`
- API Documentation: https://docs.ns-api.com/

### Documentation Resources
- Portal Customization: `netsapiens_organized_documentation/03_Portal_Administration_Configuration/`
- CSS/JS Injection Guide: `2129538-injecting-custom-css-and-js-in-the-portal.md`
- UI Configuration: `854470-how-do-i-add-modify-ui-configuration-parameters.md`
- Master UI Config List: Reference Google Sheets link in `Project-notes.md`

### Development References
- Prototype Example: `Prototype_4/` contains example of modern portal interface
- Custom Examples: `NetsapiensSeanExampleJSandCSS/` for working customization code
- Reference Images: `ref_portal_*.png` files show default portal appearance

## Key Technologies

- **Backend**: PHP with CakePHP 1.3.x framework
- **Frontend**: HTML, CSS, JavaScript with Bootstrap framework
- **Database**: MySQL/MariaDB (configured via datasources)
- **VoIP Integration**: NetSapiens API integration through custom data sources
- **Localization**: GNU gettext (.po files) for internationalization
- **Dependencies**: Composer for PHP dependencies, various vendor libraries

## Development Notes

- The portal is designed for VoIP service management (users, domains, call queues, conferences, etc.)
- Heavy emphasis on multi-tenancy (domains, resellers, sites)
- Real-time features for call center operations and agent management
- Extensive logging and debugging capabilities in `tmp/logs/`
- Security features include session management and ACL controls

## Project Goals

Based on `Project-notes.md`, the main objectives are:
1. Custom portal branding and UI enhancement
2. Potential replacement of default NetSapiens Manager Portal
3. Integration of modern UI elements (like Prototype_4 example)
4. Enhanced functionality through CSS/JS injection or custom development