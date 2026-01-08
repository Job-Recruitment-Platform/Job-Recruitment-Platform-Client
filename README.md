# 🎨 Job Recruitment Platform - Client

Ứng dụng Frontend cho nền tảng tuyển dụng việc làm, được xây dựng với Next.js 15 và React 19.

## 📋 Tổng quan

Đây là giao diện người dùng cho nền tảng tuyển dụng việc làm, cung cấp trải nghiệm tìm kiếm và ứng tuyển việc làm mượt mà cho ứng viên, cũng như công cụ quản lý tuyển dụng hiệu quả cho nhà tuyển dụng.

## ✨ Tính năng

### Dành cho Ứng viên
- 🔍 **Tìm kiếm việc làm**: Tìm kiếm thông minh với gợi ý ngữ nghĩa
- 💼 **Quản lý hồ sơ**: Tạo và cập nhật CV, thông tin cá nhân
- 📄 **Upload CV**: Tự động trích xuất thông tin từ CV
- 💡 **Gợi ý việc làm**: Nhận gợi ý việc làm phù hợp dựa trên AI
- ⭐ **Lưu việc làm**: Bookmark việc làm quan tâm
- 📝 **Ứng tuyển**: Nộp đơn ứng tuyển trực tuyến

### Dành cho Nhà tuyển dụng
- 📊 **Dashboard**: Tổng quan về tin tuyển dụng và ứng viên
- ✏️ **Quản lý tin tuyển dụng**: CRUD việc làm
- 👥 **Quản lý ứng viên**: Xem, lọc, đánh giá ứng viên
- 📈 **Thống kê**: Phân tích hiệu quả tuyển dụng

### Dành cho Admin
- 🛡️ **Quản trị hệ thống**: Quản lý người dùng, nội dung
- 📋 **Duyệt tin**: Phê duyệt/từ chối tin tuyển dụng

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| **Framework** | Next.js 15.5 (App Router) |
| **Ngôn ngữ** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI, Shadcn/ui |
| **State Management** | Zustand 5 |
| **Data Fetching** | TanStack Query (React Query) 5 |
| **Form Handling** | React Hook Form + Zod |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/             # Layout chính
│   │   ├── (candidate)/    # Trang dành cho ứng viên
│   │   ├── auth/           # Xác thực (login/register)
│   │   ├── job/            # Chi tiết việc làm
│   │   ├── recruiter/      # Trang dành cho nhà tuyển dụng
│   │   └── search/         # Tìm kiếm việc làm
│   └── admin/              # Trang quản trị
├── components/             # React components
│   ├── ui/                 # Base UI components (Shadcn)
│   └── ...                 # Feature components
├── hooks/                  # Custom React hooks
├── services/               # API service functions
├── store/                  # Zustand stores
├── types/                  # TypeScript types/interfaces
├── lib/                    # Utility functions
├── constants/              # Constants và configs
├── interceptor/            # Axios interceptors
└── styles/                 # Global styles
```

## 🚀 Khởi chạy

### Yêu cầu

- Node.js 18+
- npm / yarn / pnpm / bun

### Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd Job-Recruitment-Platform-Client
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   # hoặc
   pnpm install
   ```

3. **Cấu hình biến môi trường**
   ```bash
   cp .env.example .env.local
   ```
   
   Chỉnh sửa file `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Chạy development server**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   # hoặc
   pnpm dev
   ```

5. **Mở trình duyệt** tại [http://localhost:3000](http://localhost:3000)

## 📜 Scripts

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy development server với Turbopack |
| `npm run build` | Build production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra linting với ESLint |
| `npm run prettier` | Kiểm tra formatting |
| `npm run prettier:fix` | Tự động fix formatting |

## ⚙️ Biến môi trường

| Biến | Mô tả |
|------|-------|
| `NEXT_PUBLIC_API_URL` | URL của Backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth2 Client ID |

## 🎨 UI Components

Dự án sử dụng **Shadcn/ui** với các components từ **Radix UI**:

- **Avatar** - Hiển thị ảnh đại diện
- **Button** - Nút bấm
- **Checkbox** - Lựa chọn nhiều
- **Dialog** - Modal/Popup
- **Input** - Trường nhập liệu
- **Label** - Nhãn
- **Popover** - Menu popup
- **Radio Group** - Lựa chọn đơn
- **Select** - Dropdown select
- **Separator** - Đường phân cách

## 🔐 Xác thực

Hỗ trợ hai phương thức xác thực:

1. **Email/Password**: Đăng ký và đăng nhập truyền thống
2. **Google OAuth2**: Đăng nhập nhanh bằng tài khoản Google

JWT token được lưu trữ và tự động gửi kèm mỗi request thông qua Axios interceptor.

## 📱 Responsive Design

Giao diện được thiết kế responsive, hỗ trợ:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

## 🧪 Form Validation

Sử dụng **React Hook Form** kết hợp với **Zod** để validation:

```typescript
const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
```

## 📊 State Management

- **Zustand** cho global state (user info, auth state)
- **TanStack Query** cho server state (caching, fetching)

## 🏗️ Kiến trúc

```
┌──────────────────────────────────────────────────────────┐
│                       Client                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │                  Next.js App                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │  Pages   │  │Components│  │     Hooks        │  │  │
│  │  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │  │
│  │       │             │                  │            │  │
│  │       └─────────────┼──────────────────┘            │  │
│  │                     ▼                               │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │              Services (Axios)                 │  │  │
│  │  └──────────────────────┬───────────────────────┘  │  │
│  └─────────────────────────┼───────────────────────────┘  │
│                            │                               │
└────────────────────────────┼───────────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   Backend API   │
                    │  (Spring Boot)  │
                    └─────────────────┘
```

## 🔧 Development Tools

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundling

## 📄 License

Dự án được phát triển cho mục đích học tập và nghiên cứu.
