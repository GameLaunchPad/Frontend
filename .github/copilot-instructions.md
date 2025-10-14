# GameLaunchPad Frontend AI Instructions

This document provides essential context for AI agents working with the GameLaunchPad frontend codebase.

## Project Architecture

### Tech Stack
- Next.js 15.5 with TypeScript
- Material UI v7
- TailwindCSS
- React 19.1

### Key Directories
- `/src/app/*` - Next.js app router pages and layouts
- `/src/components/*` - Reusable React components
- `/src/services/*` - API service layer
- `/src/types/*` - TypeScript type definitions
- `/src/utils/*` - Utility functions

### Development Patterns

#### API Services
- API services are centralized in `src/services/api.ts`
- Mock data mode can be enabled via `USE_MOCK` flag
- All API types are defined in `/src/types/` directory
- Example service pattern:
```typescript
export async function createCPMaterial(request: CreateCPMaterialRequest): Promise<ApiResponse<{ material_id: string }>>
```

#### Component Organization
- Page-specific components live in `/src/app/components/`
- Shared components go in `/src/components/`
- Components follow a modular pattern with separate `.js` and `.module.css` files
- Example: `GameCard/GameCard.js` + `GameCard/GameCard.module.css`

## Development Workflow

### Setup & Running
```bash
pnpm install      # Install dependencies
pnpm dev         # Start dev server with Turbopack
pnpm build       # Production build
pnpm lint        # Run ESLint
```

### Configuration
- Environment variables are accessed via `process.env.NEXT_PUBLIC_*`
- Default API URL is `http://localhost:8080`
- Turbopack is enabled for faster builds

## Common Tasks

### Adding a New Page
1. Create new directory under `/src/app/`
2. Add `page.tsx` or `page.js` for the route
3. Include any page-specific components in a `components/` subdirectory
4. Define types in `/src/types/` if needed

### Adding New API Endpoints
1. Define request/response types in appropriate `/src/types/*.ts` file
2. Add service function in `src/services/api.ts`
3. Include mock implementation if `USE_MOCK` is true