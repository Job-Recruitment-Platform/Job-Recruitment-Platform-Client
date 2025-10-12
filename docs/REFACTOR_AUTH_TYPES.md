# Refactor: Auth Types Consolidation

## 🎯 Mục tiêu

Gộp tất cả types liên quan đến authentication vào 1 file duy nhất để dễ quản lý và maintain.

## ✅ Đã thực hiện

### 1. Gộp types vào `auth.type.ts`

**Before:**

```
src/types/
├── auth.type.ts         # Request types only
└── auth.response.ts     # Response types only
```

**After:**

```
src/types/
└── auth.type.ts         # ✅ All auth types (request + response)
```

### 2. Cấu trúc `auth.type.ts`

```typescript
// ============================================
// REQUEST TYPES (Data gửi lên server)
// ============================================
;-LoginType -
   RegisterType -
   RegisterFormType -
   // ============================================
   // RESPONSE TYPES (Data nhận từ server)
   // ============================================
   UserData -
   RegisterResponseData -
   LoginResponseData -
   AuthUser
```

### 3. Updated imports

**auth.service.ts:**

```typescript
// Before
import type { LoginResponseData, RegisterResponseData } from '@/types/auth.response'
import type { LoginType, RegisterType } from '@/types/auth.type'

// After
import type {
   LoginResponseData,
   LoginType,
   RegisterResponseData,
   RegisterType
} from '@/types/auth.type'
```

### 4. Cleaned up files

**Deleted:**

- `src/types/auth.response.ts` ❌
- `src/types/api.type.ts` (empty file) ❌

**Remaining:**

- `src/types/api.ts` ✅
- `src/types/auth.type.ts` ✅

## 📊 Benefits

✅ **Fewer files** - 3 files → 2 files
✅ **Better organization** - Group by feature, not by type
✅ **Easier to find** - All auth types in one place
✅ **Cleaner imports** - Single import statement
✅ **Better maintainability** - Update one file instead of multiple
✅ **No breaking changes** - All existing code still works

## 🔍 Verification

✅ No TypeScript errors
✅ All imports working correctly
✅ RegisterForm still functional
✅ AuthService still functional

## 📝 Next Steps

Apply same pattern to other features:

- `user.type.ts` - All user-related types
- `job.type.ts` - All job-related types
- `company.type.ts` - All company-related types
- Etc.

## 📚 References

- See `docs/TYPES_ORGANIZATION.md` for detailed guidelines
- See `docs/API_INTEGRATION.md` for updated structure
