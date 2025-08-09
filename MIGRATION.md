# Migration Guide: Moving to @estebanbasili/med-schemas

This guide helps you migrate from local schemas to the shared schemas package.

## 🔄 Backend Migration

### 1. Update Imports

**Before:**
```typescript
import { UserDocument } from '../schemas';
import { PacienteSchema } from '../schemas/paciente.schema';
import { HistoriaClinicaDocument } from '../schemas/historiaClinica.schema';
```

**After:**
```typescript
import { User, UserSchema, Paciente, PacienteSchema, HistoriaClinica, HistoriaClinicaSchema } from '@estebanbasili/med-schemas';
```

### 2. Update Controllers

**Before:**
```typescript
// controllers/user.controller.ts
import { UserFormSchema } from '../schemas/user.schema';

export const createUser = async (req: Request, res: Response) => {
  const validatedData = UserFormSchema.parse(req.body);
  // ...
};
```

**After:**
```typescript
// controllers/user.controller.ts
import { UserFormSchema } from '@estebanbasili/med-schemas';

export const createUser = async (req: Request, res: Response) => {
  const validatedData = UserFormSchema.parse(req.body);
  // ...
};
```

### 3. Update Models

**Before:**
```typescript
// models/user.model.ts
import { UserDocument } from "../schemas";

const userSchema = new Schema<UserDocument>({
  // schema definition
});
```

**After:**
```typescript
// models/user.model.ts
import { User } from "@estebanbasili/med-schemas";
import { Document } from "mongoose";

interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>({
  // schema definition (keep existing)
});
```

## 🎨 Frontend Migration

### 1. Update Type Imports

**Before:**
```typescript
import { User, Paciente, HistoriaClinica } from '../types/backend-types';
```

**After:**
```typescript
import { User, Paciente, HistoriaClinica } from '@estebanbasili/med-schemas';
```

### 2. Update API Types

**Before:**
```typescript
// api/user.api.ts
import { ApiResponse } from '../types';

export const userApi = {
  getAll: (): Promise<ApiResponse<User[]>> => // ...
};
```

**After:**
```typescript
// api/user.api.ts
import { ApiResponse, User } from '@estebanbasili/med-schemas';

export const userApi = {
  getAll: (): Promise<ApiResponse<User[]>> => // ...
};
```

### 3. Update Form Validation

**Before:**
```typescript
// Local validation logic
const validateUser = (data: unknown) => {
  // manual validation
};
```

**After:**
```typescript
import { UserFormSchema } from '@estebanbasili/med-schemas';

const validateUser = (data: unknown) => {
  return UserFormSchema.parse(data);
};
```

## 📋 Checklist

### Backend Files to Update:
- [ ] `src/controllers/*.ts` - Update schema imports
- [ ] `src/models/*.ts` - Update type definitions  
- [ ] `src/routes/*.ts` - Update validation middleware
- [ ] `src/middleware/*.ts` - Update type checking
- [ ] Remove old `src/schemas/` directory

### Frontend Files to Update:
- [ ] `src/types/backend-types.ts` - Replace with schema imports
- [ ] `src/api/*.ts` - Update type imports
- [ ] `src/store/*.ts` - Update type definitions
- [ ] `src/components/**/*.tsx` - Update prop types
- [ ] `src/hooks/*.ts` - Update type definitions

## ⚠️ Important Notes

1. **Gradual Migration**: You can migrate one file at a time
2. **Type Safety**: The new schemas provide better type safety
3. **Validation**: Frontend and backend now use identical validation
4. **Breaking Changes**: Some field names may have been standardized

## 🐛 Common Issues

### Issue: Module not found
```
Error: Cannot resolve '@estebanbasili/med-schemas'
```

**Solution**: Make sure the package is installed:
```bash
npm install @estebanbasili/med-schemas
```

### Issue: Type mismatch
```
Type 'OldUser' is not assignable to type 'User'
```

**Solution**: Check the schema changes and update your code accordingly. The new schemas may have:
- Different optional/required fields
- Standardized field names
- Enhanced validation rules

### Issue: Build errors after migration
**Solution**: 
1. Clear build cache: `npm run clean && npm run build`
2. Check imports are correct
3. Ensure TypeScript versions are compatible

## 🚀 Benefits After Migration

- ✅ **Type Safety**: Consistent types across frontend and backend
- ✅ **Single Source of Truth**: Changes in one place update both apps
- ✅ **Better DX**: Auto-completion and IntelliSense
- ✅ **Reduced Bugs**: Eliminate type mismatches
- ✅ **Easier Maintenance**: Centralized schema management