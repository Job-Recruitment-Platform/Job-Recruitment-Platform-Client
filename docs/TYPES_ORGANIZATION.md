# Types Organization

## 📁 Structure

```
src/types/
├── api.ts           # Base API types (ApiResponse, PaginatedResponse, etc.)
└── auth.type.ts     # All auth-related types (request + response)
```

## 🎯 Quy tắc

### ✅ Gộp types theo domain/feature

- **auth.type.ts** - Tất cả types liên quan đến authentication
- **user.type.ts** - Tất cả types liên quan đến user
- **job.type.ts** - Tất cả types liên quan đến job
- Etc.

### ❌ Không tách request/response riêng

**Bad:**

```
types/
├── auth.request.ts
├── auth.response.ts
├── user.request.ts
└── user.response.ts
```

**Good:**

```
types/
├── auth.type.ts      # Chứa cả request & response
└── user.type.ts      # Chứa cả request & response
```

## 📝 Template

```typescript
// feature.type.ts

// ============================================
// REQUEST TYPES (Data gửi lên server)
// ============================================

export interface CreateFeatureType {
   name: string
   description: string
}

export interface UpdateFeatureType extends Partial<CreateFeatureType> {
   id: number
}

// ============================================
// RESPONSE TYPES (Data nhận từ server)
// ============================================

export interface FeatureData {
   id: number
   name: string
   description: string
   createdAt: string
   updatedAt: string
}

export interface FeatureListResponse {
   items: FeatureData[]
   total: number
}

// ============================================
// UI/FORM TYPES (Chỉ dùng trong component)
// ============================================

export interface FeatureFormType extends CreateFeatureType {
   confirmField?: string
}
```

## 🎨 Benefits

✅ **Dễ tìm kiếm** - Tất cả auth types ở 1 chỗ
✅ **Ít files hơn** - Giảm clutter trong folder
✅ **Dễ maintain** - Update 1 file thay vì nhiều files
✅ **Rõ ràng hơn** - Phân chia theo domain/feature
✅ **Import gọn** - `import { LoginType, LoginResponseData } from '@/types/auth.type'`

## 💡 Best Practices

1. **Group by feature/domain**, not by request/response
2. **Use comments** để phân chia sections rõ ràng
3. **Export named types**, không dùng default export
4. **Consistent naming**:
   - Request: `CreateUserType`, `UpdateUserType`
   - Response: `UserData`, `UserListResponse`
   - Form: `UserFormType`
