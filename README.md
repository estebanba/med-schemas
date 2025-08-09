# @estebanbasili/med-schemas

Shared Zod schemas for the Medical System (Frontend & Backend)

## 🎯 Purpose

This package provides a single source of truth for all data validation schemas used across the medical system's frontend and backend applications. By centralizing schemas in a shared package, we ensure:

- **Type Safety**: Consistent TypeScript types across all applications
- **Validation Consistency**: Same validation rules in frontend and backend
- **Developer Experience**: Single place to update schema changes
- **Reduced Errors**: Eliminate type mismatches between frontend and backend

## 📦 Installation

```bash
npm install @estebanbasili/med-schemas
```

## 🚀 Usage

### Backend (Node.js/Express)

```typescript
import { UserSchema, PacienteSchema, HistoriaClinicaSchema } from '@estebanbasili/med-schemas';

// Validate request data
const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    // ... proceed with validated data
  } catch (error) {
    // Handle validation errors
  }
};
```

### Frontend (React/TypeScript)

```typescript
import { User, Paciente, HistoriaClinica } from '@estebanbasili/med-schemas';

// Use as TypeScript types
interface UserCardProps {
  user: User;
}

// Validate form data
const handleSubmit = (formData: unknown) => {
  try {
    const validatedUser = UserSchema.parse(formData);
    // ... submit validated data
  } catch (error) {
    // Handle validation errors
  }
};
```

## 📚 Available Schemas

### Core Entities
- **UserSchema**: User accounts and authentication
- **ClientSchema**: Multi-tenant client organizations
- **RoleSchema**: User roles and permissions
- **TeamSchema**: User team organization

### Medical Entities
- **PacienteSchema**: Patient information
- **EmpresaSchema**: Company/organization data
- **HistoriaClinicaSchema**: Medical records and clinical history

### Admin & Analytics
- **AdminStatsSchema**: System statistics
- **DashboardStatsSchema**: Dashboard analytics data
- **ActivityLogSchema**: User activity tracking

### Common Utilities
- **ApiResponseSchema**: Standardized API responses
- **PaginationSchema**: Pagination parameters
- **AuthoringSchema**: Creation/modification tracking

## 🔧 Development

### Building the Package

```bash
npm run build
```

### Development Mode (Watch)

```bash
npm run dev
```

### Publishing

```bash
npm run prepublishOnly
npm publish
```

## 📝 Schema Structure

All schemas follow consistent patterns:

- **Base Schema**: Full entity with all fields
- **Form Schema**: Omits auto-generated fields (\_id, timestamps, etc.)
- **Update Schema**: Partial schema for updates
- **Filters Schema**: Query parameters for listing/filtering

Example:
```typescript
export const UserSchema = z.object({ /* full schema */ });
export const UserFormSchema = UserSchema.omit({ _id: true, createdAt: true });
export const UserUpdateSchema = UserSchema.partial();
```

## 🛡️ Type Safety

All schemas automatically generate TypeScript types:

```typescript
type User = z.infer<typeof UserSchema>;
type UserForm = z.infer<typeof UserFormSchema>;
```

## 🔄 Versioning

This package follows semantic versioning:
- **Patch**: Bug fixes, internal changes
- **Minor**: New optional fields, new schemas
- **Major**: Breaking changes, required field changes

## 🤝 Contributing

1. Update schemas in `src/` directory
2. Run tests to ensure compatibility
3. Update version in `package.json`
4. Build and publish

## 📄 License

MIT License - See LICENSE file for details