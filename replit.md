# AuthVault - OAuth 2.0 As a Service Platform

## Overview

AuthVault is a comprehensive OAuth 2.0 authentication and transaction management platform designed for enterprise use. It provides secure client-server authentication using industry-standard OAuth 2.0 protocols, along with specialized transaction token management for three-party workflows involving Initiators, Controllers, and Executors. The platform features a modern web dashboard for client management, real-time monitoring, API documentation, and testing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod schema validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **JWT Implementation**: Custom JWT service for OAuth 2.0 access tokens
- **Middleware**: Custom rate limiting, authentication, and session management
- **API Design**: RESTful endpoints following OAuth 2.0 specifications

### Database Design
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Structure**: 
  - Users → Clients (one-to-many relationship)
  - Clients → Access Tokens/Transaction Tokens (one-to-many)
  - Transaction Tokens → Transactions (one-to-one)
  - API request logging for monitoring and analytics
- **Multi-tenancy**: Complete data isolation per user account

### Security Architecture
- **OAuth 2.0 Flow**: Client credentials grant type implementation
- **Token Management**: JWT-based access tokens with configurable expiration
- **Transaction Security**: Single-use transaction tokens with expiration
- **Rate Limiting**: IP-based request throttling to prevent abuse
- **Session Security**: HTTP-only cookies with proper expiration handling

### Transaction Workflow System
- **Three-Party Model**: Initiator, Controller (AuthVault), and Executor roles
- **Token Generation**: Secure transaction token creation with UUID-based identifiers
- **Status Tracking**: Real-time transaction lifecycle monitoring
- **Validation**: Single-use token validation with automatic expiration

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **@radix-ui/***: Accessible UI component primitives for shadcn/ui components
- **@tanstack/react-query**: Server state management and caching library
- **@hookform/resolvers**: Form validation resolvers for React Hook Form integration

### Authentication & Security
- **bcryptjs**: Password hashing and verification
- **jsonwebtoken**: JWT token generation and validation
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **drizzle-kit**: Database schema management and migrations
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### UI & Styling
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library with consistent design

### Form & Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **zod**: Schema validation library for type-safe data validation
- **date-fns**: Date manipulation and formatting utilities