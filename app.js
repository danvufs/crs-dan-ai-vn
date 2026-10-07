const STORAGE_KEY = 'crs-demo-records-v1';
const STATUS_OPTIONS = ['Mới', 'Đang xử lý', 'Chờ bổ sung', 'Hoàn tất', 'Từ chối'];

const initialRecords = [
  {
    id: 'HS-2026-001',
    assignee: 'Nguyễn Văn An',
    type: 'Khiếu nại',
    priority: 'Cao',
    status: 'Đang xử lý',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-03',
    description: 'Khách hàng phản ánh thời gian xử lý hợp đồng kéo dài hơn SLA tiêu chuẩn.'
  },
  {
    id: 'HS-2026-002',
    assignee: 'Trần Minh Châu',
    type: 'Yêu cầu hỗ trợ',
    priority: 'Trung bình',
    status: 'Mới',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-04',
    description: 'Đề nghị cấp lại thông tin tài khoản truy cập cổng nghiệp vụ.'
  },
  {
    id: 'HS-2026-003',
    assignee: 'Lê Quỳnh Như',
    type: 'Đề nghị dịch vụ',
    priority: 'Thấp',
    status: 'Hoàn tất',
    createdAt: '2026-09-26',
    updatedAt: '2026-10-02',
    description: 'Yêu cầu kích hoạt gói theo dõi hồ sơ tự động cho nhóm vận hành.'
  }
];

const state = {
  records: [],
  selectedId: null,
  error: false
};

const elements = {
  summaryCards: document.getElementById('summary-cards'),
  recordsBody: document.getElementById('records-body'),
  detailContent: document.getElementById('detail-content'),
  searchInput: document.getElementById('search-input'),
  statusFilter: document.getElementById('status-filter'),
  typeFilter: document.getElementById('type-filter'),
  emptyState: document.getElementById('empty-state'),
  loadingOverlay: document.getElementById('loading-overlay'),
  errorBanner: document.getElementById('error-banner'),
  resetData: document.getElementById('reset-data'),
  createModal: document.getElementById('create-modal'),
  openCreateModal: document.getElementById('open-create-modal'),
  cancelCreate: document.getElementById('cancel-create'),
  createForm: document.getElementById('create-form'),
  formError: document.getElementById('form-error')
};

const normalize = (value) => value.toLowerCase().normalize('NFC');
const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadRecords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveRecords(initialRecords);
    return [...initialRecords];
  }

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('invalid_records');
  }

  return parsed;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function statusClass(status) {
  return `status-${status.replaceAll(' ', '-').normalize('NFC')}`;
}

function getFilteredRecords() {
  const term = normalize(elements.searchInput.value.trim());
  const status = elements.statusFilter.value;
  const type = elements.typeFilter.value;

  return state.records.filter((record) => {
    const text = normalize([record.id, record.assignee, record.description].join(' '));
    const matchSearch = !term || text.includes(term);
    const matchStatus = status === 'all' || record.status === status;
    const matchType = type === 'all' || record.type === type;
    return matchSearch && matchStatus && matchType;
  });
}

function renderSummary(records) {
  const total = records.length;
  const done = records.filter((record) => record.status === 'Hoàn tất').length;
  const inProgress = records.filter((record) => record.status === 'Đang xử lý').length;
  const newCount = records.filter((record) => record.status === 'Mới').length;
  const completionRate = total ? `${Math.round((done / total) * 100)}%` : '0%';

  const cards = [
    ['Tổng hồ sơ', total],
    ['Hồ sơ mới', newCount],
    ['Đang xử lý', inProgress],
    ['Tỷ lệ hoàn tất', completionRate]
  ];

  elements.summaryCards.innerHTML = cards
    .map(
      ([label, value]) => `<article class="summary-card"><p class="label">${label}</p><p class="value">${value}</p></article>`
    )
    .join('');
}

function renderFilters(records) {
  const statuses = [...new Set(records.map((record) => record.status))];
  const types = [...new Set(records.map((record) => record.type))];

  const statusCurrent = elements.statusFilter.value;
  const typeCurrent = elements.typeFilter.value;

  elements.statusFilter.innerHTML = `<option value="all">Tất cả</option>${statuses
    .map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`)
    .join('')}`;
  elements.typeFilter.innerHTML = `<option value="all">Tất cả</option>${types
    .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
    .join('')}`;

  elements.statusFilter.value = statuses.includes(statusCurrent) ? statusCurrent : 'all';
  elements.typeFilter.value = types.includes(typeCurrent) ? typeCurrent : 'all';
}

function renderRecords() {
  const filtered = getFilteredRecords();

  elements.emptyState.classList.toggle('hidden', filtered.length > 0);
  elements.recordsBody.innerHTML = filtered
    .map(
      (record) => `
        <tr>
          <td><strong>${escapeHtml(record.id)}</strong></td>
          <td>${escapeHtml(record.assignee)}</td>
          <td>${escapeHtml(record.type)}</td>
          <td>${formatDate(record.createdAt)}</td>
          <td><span class="status-pill ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
          <td>${escapeHtml(record.priority)}</td>
          <td>
            <div class="inline-actions">
              <button class="btn btn-secondary" type="button" data-action="detail" data-id="${escapeHtml(record.id)}">Chi tiết</button>
              <select aria-label="Cập nhật trạng thái ${escapeHtml(record.id)}" data-action="status" data-id="${escapeHtml(record.id)}">
                ${STATUS_OPTIONS.map(
                  (status) =>
                    `<option value="${escapeHtml(status)}" ${status === record.status ? 'selected' : ''}>${escapeHtml(status)}</option>`
                ).join('')}
              </select>
            </div>
          </td>
        </tr>`
    )
    .join('');
}

function renderDetail() {
  const selected = state.records.find((record) => record.id === state.selectedId);
  if (!selected) {
    elements.detailContent.innerHTML = '<p>Chọn một hồ sơ để xem chi tiết.</p>';
    return;
  }

  elements.detailContent.innerHTML = `
    <div class="kv"><strong>Mã hồ sơ</strong><span>${escapeHtml(selected.id)}</span></div>
    <div class="kv"><strong>Người phụ trách</strong><span>${escapeHtml(selected.assignee)}</span></div>
    <div class="kv"><strong>Loại hồ sơ</strong><span>${escapeHtml(selected.type)}</span></div>
    <div class="kv"><strong>Trạng thái</strong><span class="status-pill ${statusClass(selected.status)}">${escapeHtml(selected.status)}</span></div>
    <div class="kv"><strong>Ưu tiên</strong><span>${escapeHtml(selected.priority)}</span></div>
    <div class="kv"><strong>Ngày cập nhật</strong><span>${formatDate(selected.updatedAt)}</span></div>
    <div class="kv"><strong>Mô tả</strong><span>${escapeHtml(selected.description)}</span></div>
  `;
}

function syncUI() {
  renderSummary(state.records);
  renderFilters(state.records);
  renderRecords();
  renderDetail();
}

function updateStatus(id, status) {
  state.records = state.records.map((record) =>
    record.id === id ? { ...record, status, updatedAt: new Date().toISOString().slice(0, 10) } : record
  );
  saveRecords(state.records);
  syncUI();
}

function createRecord(formData) {
  const now = new Date().toISOString().slice(0, 10);
  const randomSuffix = String(Date.now()).slice(-4);
  const newRecord = {
    id: `HS-${new Date().getFullYear()}-${randomSuffix}`,
    assignee: formData.get('assignee').toString().trim(),
    type: formData.get('type').toString(),
    priority: formData.get('priority').toString(),
    status: 'Mới',
    createdAt: now,
    updatedAt: now,
    description: formData.get('description').toString().trim()
  };

  state.records = [newRecord, ...state.records];
  state.selectedId = newRecord.id;
  saveRecords(state.records);
  syncUI();
}

function bindEvents() {
  [elements.searchInput, elements.statusFilter, elements.typeFilter].forEach((element) =>
    element.addEventListener('input', renderRecords)
  );

  elements.recordsBody.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.action === 'detail' && target.dataset.id) {
      state.selectedId = target.dataset.id;
      renderDetail();
    }
  });

  elements.recordsBody.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (target.dataset.action === 'status' && target.dataset.id) {
      updateStatus(target.dataset.id, target.value);
    }
  });

  elements.openCreateModal.addEventListener('click', () => {
    elements.formError.classList.add('hidden');
    elements.createForm.reset();
    elements.createModal.showModal();
  });

  elements.cancelCreate.addEventListener('click', () => elements.createModal.close());

  elements.createForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(elements.createForm);
    const requiredFields = ['assignee', 'type', 'priority', 'description'];
    const isValid = requiredFields.every((name) => formData.get(name)?.toString().trim());

    if (!isValid) {
      elements.formError.classList.remove('hidden');
      return;
    }

    createRecord(formData);
    elements.createModal.close();
  });

  elements.resetData.addEventListener('click', () => {
    state.error = false;
    elements.errorBanner.classList.add('hidden');
    state.records = [...initialRecords];
    state.selectedId = null;
    saveRecords(state.records);
    syncUI();
  });
}

function init() {
  bindEvents();

  setTimeout(() => {
    try {
      state.records = loadRecords();
      state.error = false;
      elements.errorBanner.classList.add('hidden');
    } catch {
      state.records = [];
      state.error = true;
      elements.errorBanner.classList.remove('hidden');
    } finally {
      elements.loadingOverlay.classList.add('hidden');
      syncUI();
    }
  }, 400);
}

init();
