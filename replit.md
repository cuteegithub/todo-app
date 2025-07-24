# TaskFlow - Mobile Task Management Application

## Overview

TaskFlow is a mobile-first task management application built as part of a hackathon project. The application provides a complete full-stack solution with demo authentication, full CRUD operations for tasks, and a responsive mobile interface optimized for touch interactions. Successfully completed with all hackathon requirements met.

## Recent Changes (July 24, 2025)

✓ **Completed Full Application**: Built comprehensive mobile task management PWA
✓ **Authentication System**: Implemented demo authentication with session management  
✓ **Task Management**: Full CRUD operations with title, description, due date, status, priority
✓ **Mobile UI**: Touch-optimized interface with pull-to-refresh, FAB, bottom navigation
✓ **Data Validation**: Proper Zod schemas for client/server validation
✓ **Memory Storage**: Switched to in-memory storage for hackathon demo reliability
✓ **Profile System**: Added personalized profile page for user "Sindhuja" with sample tasks
✓ **Female-Focused UX**: Customized avatar, tasks, and profile content for girl user experience

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Mobile-First Design**: Responsive components optimized for mobile devices

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth integration for social login (Google, GitHub, etc.)
- **API Design**: RESTful API with proper error handling and validation
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: Hot reloading with Vite middleware integration

### Database Layer
- **Primary Database**: PostgreSQL with Neon serverless integration
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Database migrations and schema definitions
- **Fallback Storage**: In-memory storage for development/testing

## Key Components

### Authentication System
- **Social Login**: Integration with Replit Auth supporting multiple providers
- **Session Management**: Persistent sessions stored in PostgreSQL
- **User Management**: User profile storage with creation/update timestamps
- **Protected Routes**: Middleware-based route protection

### Task Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Task Properties**: Title, description, due date, status (open/completed), priority levels
- **Data Validation**: Zod schemas for client and server-side validation
- **Real-time Updates**: Optimistic updates with React Query

### Mobile UI Components
- **Task Filters**: Search and filter functionality (all, active, completed, high priority)
- **Floating Action Button**: Quick task creation
- **Pull-to-Refresh**: Native mobile gesture support
- **Swipe Interactions**: Task completion and deletion gestures
- **Bottom Navigation**: Mobile-first navigation pattern
- **Responsive Modals**: Touch-optimized dialogs and forms

### Progressive Web App Features
- **Mobile Optimization**: Viewport configuration and touch-friendly interactions
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Web App Manifest**: PWA capabilities for mobile installation

## Data Flow

1. **Authentication Flow**:
   - User initiates social login through Replit Auth
   - Server validates and creates/updates user session
   - Client receives authentication state and user data
   - Protected routes accessible after authentication

2. **Task Operations**:
   - Client requests filtered/searched tasks from server
   - Server validates user permissions and returns relevant tasks
   - Client optimistically updates UI for mutations
   - Background synchronization ensures data consistency

3. **Real-time Updates**:
   - React Query manages cache invalidation
   - Mutations trigger automatic refetching
   - Optimistic updates provide immediate feedback

## External Dependencies

### Authentication
- **Replit Auth**: Social authentication provider integration
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations with migration support

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Fast development server with HMR
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reloading**: Full-stack development with instant updates
- **Environment Variables**: Separate configuration for development/production

### Production Build
- **Frontend**: Static build optimized for mobile performance
- **Backend**: Node.js server with compiled TypeScript
- **Database**: Neon PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-backed sessions for scalability

### Mobile Deployment
- **Progressive Web App**: Installable on mobile devices
- **Responsive Design**: Optimized for various screen sizes
- **Performance**: Minimized bundle size and lazy loading

The architecture prioritizes mobile user experience while maintaining scalability and maintainability. The choice of modern web technologies ensures fast development cycles and excellent performance on mobile devices.