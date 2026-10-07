# CRS Demo Prototype (VI/EN)

## 🇻🇳 Tiếng Việt

### Giới thiệu
Đây là **prototype/demo** giao diện web quản lý hồ sơ (CRS) được xây dựng độc lập để mô phỏng luồng nghiệp vụ cơ bản: theo dõi tổng quan, tạo hồ sơ, tìm kiếm/lọc, cập nhật trạng thái và xem chi tiết.

> Lưu ý: Dự án này chỉ là bản minh hoạ, **không phải bản sao đảo ngược (reverse-engineered)** và **không liên kết/đại diện** cho dịch vụ production tại `crs.dan.ai.vn`.

### Tính năng chính
- Dashboard tổng quan (thẻ số liệu)
- Danh sách hồ sơ có tìm kiếm và lọc theo trạng thái/loại
- Tạo hồ sơ mới qua modal form
- Cập nhật trạng thái trực tiếp trong danh sách
- Xem chi tiết hồ sơ
- Lưu dữ liệu bằng `localStorage` (giữ dữ liệu sau khi refresh)
- Trạng thái giao diện thân thiện: loading, empty, error/recovery
- UI responsive, nhãn tiếng Việt, hỗ trợ điều hướng bàn phím cơ bản

### Mô tả giao diện / placeholder screenshot
- Header + nút “Tạo hồ sơ mới”
- Khu vực tổng quan (4 summary cards)
- Bảng hồ sơ + thanh filter
- Khung chi tiết hồ sơ được chọn
- Modal tạo hồ sơ

### Chạy local
Không cần backend và không cần cài thêm dependency.

Cách nhanh nhất:
1. Clone repo
2. Mở file `index.html` bằng trình duyệt

Hoặc chạy HTTP server tĩnh:
```bash
cd /path/to/crs-dan-ai-vn
python -m http.server 8000
# mở http://localhost:8000
```

### Cấu trúc dự án
- `index.html`: cấu trúc giao diện và semantic layout
- `styles.css`: thiết kế responsive và thành phần UI
- `app.js`: dữ liệu mock, logic lọc/tạo/cập nhật hồ sơ, localStorage
- `LICENSE`: giấy phép MIT

### Giới hạn hiện tại
- Chưa có backend/API thật
- Chưa có xác thực người dùng hoặc phân quyền
- Dữ liệu chỉ lưu theo trình duyệt hiện tại
- Chưa có test automation

### Hướng phát triển tiếp theo
- Tách module JS + bổ sung test
- Kết nối API backend thật
- Bổ sung phân quyền, lịch sử thao tác (audit log), export báo cáo
- Tích hợp biểu đồ chuyên sâu và SLA tracking

---

## 🇬🇧 English

### Overview
This repository contains a **self-contained CRS web prototype/demo** that approximates a record management workflow: dashboard summary, create/manage records, search/filter, status tracking, and detail view.

> Disclaimer: This is an original demo implementation. It is **not** a reverse-engineered copy of `crs.dan.ai.vn` and has **no official affiliation** with the production service.

### Features
- Dashboard summary cards
- Searchable/filterable records table
- Create-record modal form
- Inline status updates
- Record detail panel
- `localStorage` persistence across refreshes
- Friendly loading/empty/error states
- Responsive UI with Vietnamese labels and accessible semantics

### UI description / screenshot placeholder
- Header with “Create record” action
- Summary cards section
- Filter + records list section
- Selected record detail section
- Modal form for new record creation

### Run locally
No backend required; no extra dependencies required.

Option A:
1. Clone repository
2. Open `index.html` directly in a browser

Option B (static server):
```bash
cd /path/to/crs-dan-ai-vn
python -m http.server 8000
# open http://localhost:8000
```

### Project structure
- `index.html` – semantic page structure
- `styles.css` – responsive styling
- `app.js` – mock data + UI interactions + localStorage persistence
- `LICENSE` – MIT license

### Limitations
- No real backend integration
- No auth/authorization
- Browser-local storage only
- No automated test suite yet

### Next steps
- Modularize JS and add automated tests
- Integrate real backend APIs
- Add RBAC, audit trail, reporting export
- Add deeper analytics and SLA metrics
