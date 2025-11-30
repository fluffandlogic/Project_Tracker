// Dashboard JavaScript - Material Design 3 CRUD Interface

// Data Management
let projects = [];
let filteredProjects = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = { field: 'id', direction: 'asc' };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  setupEventListeners();
  renderTable();
  updatePagination();
});

// Load projects from localStorage
function loadProjects() {
  const stored = localStorage.getItem('dashboard-projects');
  if (stored) {
    projects = JSON.parse(stored);
  } else {
    // Initialize with empty array or sample data
    projects = [];
  }
  filteredProjects = [...projects];
}

// Save projects to localStorage
function saveProjects() {
  localStorage.setItem('dashboard-projects', JSON.stringify(projects));
  showSnackbar('Projects saved successfully');
}

// Setup event listeners
function setupEventListeners() {
  // Add project button
  document.getElementById('btn-add-project').addEventListener('click', openAddModal);
  
  // Modal buttons
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('btn-save').addEventListener('click', saveProject);
  document.getElementById('btn-delete').addEventListener('click', deleteProject);
  
  // Search
  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('clear-search').addEventListener('click', clearSearch);
  
  // Filters
  document.getElementById('filter-project-lead').addEventListener('change', handleFilter);
  document.getElementById('filter-date-range').addEventListener('change', handleFilter);
  
  // Pagination
  document.getElementById('btn-prev').addEventListener('click', () => changePage(currentPage - 1));
  document.getElementById('btn-next').addEventListener('click', () => changePage(currentPage + 1));
  document.getElementById('items-per-page-select').addEventListener('change', handleItemsPerPageChange);
  
  // Sort headers
  document.querySelectorAll('.sortable-header').forEach(header => {
    header.addEventListener('click', () => handleSort(header.dataset.sort));
  });
  
  // Close modal on backdrop click
  document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') {
      closeModal();
    }
  });
}

// Generate next ID (autoincrement)
function getNextId() {
  if (projects.length === 0) return 1;
  const maxId = Math.max(...projects.map(p => p.id));
  return maxId + 1;
}

// Open modal for adding new project
function openAddModal() {
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('project-form');
  const title = document.getElementById('modal-title');
  const deleteBtn = document.getElementById('btn-delete');
  
  title.textContent = 'Add Project';
  deleteBtn.classList.add('hidden');
  form.reset();
  document.getElementById('project-id').value = getNextId();
  
  modal.classList.add('show');
}

// Open modal for editing project
function openEditModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.getElementById('project-modal');
  const form = document.getElementById('project-form');
  const title = document.getElementById('modal-title');
  const deleteBtn = document.getElementById('btn-delete');
  
  title.textContent = 'Edit Project';
  deleteBtn.classList.remove('hidden');
  deleteBtn.dataset.projectId = projectId;
  
  document.getElementById('project-id').value = project.id;
  document.getElementById('project-name').value = project.name;
  document.getElementById('project-lead').value = project.lead;
  document.getElementById('start-date').value = project.startDate;
  document.getElementById('end-date').value = project.endDate;
  document.getElementById('figma-link').value = project.figmaLink || '';
  
  modal.classList.add('show');
}

// Close modal
function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.classList.remove('show');
  const form = document.getElementById('project-form');
  form.reset();
}

// Save project (add or update)
function saveProject() {
  const form = document.getElementById('project-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  const id = parseInt(document.getElementById('project-id').value);
  const name = document.getElementById('project-name').value.trim();
  const lead = document.getElementById('project-lead').value.trim();
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const figmaLink = document.getElementById('figma-link').value.trim();
  
  const existingIndex = projects.findIndex(p => p.id === id);
  
  const projectData = {
    id,
    name,
    lead,
    startDate,
    endDate,
    figmaLink
  };
  
  if (existingIndex >= 0) {
    // Update existing
    projects[existingIndex] = projectData;
    showSnackbar(`Project "${name}" updated successfully`);
  } else {
    // Add new
    projects.push(projectData);
    showSnackbar(`Project "${name}" added successfully`);
  }
  
  saveProjects();
  applyFilters();
  renderTable();
  updatePagination();
  updateFilterOptions();
  closeModal();
}

// Delete project
function deleteProject() {
  const deleteBtn = document.getElementById('btn-delete');
  const projectId = parseInt(deleteBtn.dataset.projectId);
  
  if (confirm('Are you sure you want to delete this project?')) {
    const project = projects.find(p => p.id === projectId);
    projects = projects.filter(p => p.id !== projectId);
    
    saveProjects();
    applyFilters();
    renderTable();
    updatePagination();
    updateFilterOptions();
    closeModal();
    
    if (project) {
      showSnackbar(`Project "${project.name}" deleted successfully`);
    }
  }
}

// Search functionality
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  const clearBtn = document.getElementById('clear-search');
  
  if (searchTerm) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  
  applyFilters();
  renderTable();
  updatePagination();
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('clear-search').classList.add('hidden');
  applyFilters();
  renderTable();
  updatePagination();
}

// Filter functionality
function handleFilter() {
  applyFilters();
  renderTable();
  updatePagination();
}

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const leadFilter = document.getElementById('filter-project-lead').value;
  const dateFilter = document.getElementById('filter-date-range').value;
  
  filteredProjects = projects.filter(project => {
    // Search filter
    if (searchTerm) {
      const searchableText = `${project.name} ${project.lead} ${project.figmaLink}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    // Lead filter
    if (leadFilter && project.lead !== leadFilter) {
      return false;
    }
    
    // Date range filter
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = project.startDate ? new Date(project.startDate) : null;
      const endDate = project.endDate ? new Date(project.endDate) : null;
      
      if (dateFilter === 'upcoming') {
        if (!startDate || startDate < today) return false;
      } else if (dateFilter === 'past') {
        if (!endDate || endDate >= today) return false;
      } else if (dateFilter === 'current') {
        if (!startDate || !endDate) return false;
        if (startDate > today || endDate < today) return false;
      }
    }
    
    return true;
  });
  
  // Apply sorting
  applySorting();
  
  // Reset to first page
  currentPage = 1;
}

// Sorting functionality
function handleSort(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
  
  applySorting();
  updateSortIcons();
  renderTable();
}

function applySorting() {
  filteredProjects.sort((a, b) => {
    let aVal = a[currentSort.field];
    let bVal = b[currentSort.field];
    
    // Handle date sorting
    if (currentSort.field === 'startDate' || currentSort.field === 'endDate') {
      aVal = aVal ? new Date(aVal) : new Date(0);
      bVal = bVal ? new Date(bVal) : new Date(0);
    } else {
      // String sorting
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }
    
    if (currentSort.direction === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
}

function updateSortIcons() {
  document.querySelectorAll('.sortable-header').forEach(header => {
    const icon = header.querySelector('.sort-icon');
    if (header.dataset.sort === currentSort.field) {
      header.classList.add(`sort-${currentSort.direction}`);
      icon.textContent = currentSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
    } else {
      header.classList.remove('sort-asc', 'sort-desc');
      icon.textContent = 'unfold_more';
    }
  });
}

// Render table
function renderTable() {
  const tbody = document.getElementById('projects-tbody');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProjects = filteredProjects.slice(startIndex, endIndex);
  
  if (pageProjects.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px; color: var(--md-sys-color-on-surface-variant);">
          No projects found. Click "Add Project" to create one.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pageProjects.map(project => `
    <tr>
      <td>${project.id}</td>
      <td>${escapeHtml(project.name)}</td>
      <td>${escapeHtml(project.lead)}</td>
      <td>${formatDate(project.startDate)}</td>
      <td>${formatDate(project.endDate)}</td>
      <td class="link-cell">
        ${project.figmaLink ? `
          <a href="${escapeHtml(project.figmaLink)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(project.figmaLink)}
          </a>
        ` : '<span style="color: var(--md-sys-color-on-surface-variant);">—</span>'}
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-button edit" onclick="openEditModal(${project.id})" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="action-button delete" onclick="handleDeleteClick(${project.id})" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Handle delete click
function handleDeleteClick(projectId) {
  if (confirm('Are you sure you want to delete this project?')) {
    const project = projects.find(p => p.id === projectId);
    projects = projects.filter(p => p.id !== projectId);
    
    saveProjects();
    applyFilters();
    renderTable();
    updatePagination();
    updateFilterOptions();
    
    if (project) {
      showSnackbar(`Project "${project.name}" deleted successfully`);
    }
  }
}

// Pagination
function changePage(page) {
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderTable();
  updatePagination();
}

function handleItemsPerPageChange(e) {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
  updatePagination();
}

function updatePagination() {
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Update info
  document.getElementById('pagination-info').textContent = 
    `Showing ${startItem}-${endItem} of ${totalItems}`;
  
  // Update buttons
  document.getElementById('btn-prev').disabled = currentPage === 1;
  document.getElementById('btn-next').disabled = currentPage === totalPages || totalPages === 0;
  
  // Update page numbers
  const pageNumbers = document.getElementById('page-numbers');
  pageNumbers.innerHTML = '';
  
  if (totalPages === 0) return;
  
  // Show up to 5 page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.className = `page-number ${i === currentPage ? 'active' : ''}`;
    button.textContent = i;
    button.addEventListener('click', () => changePage(i));
    pageNumbers.appendChild(button);
  }
}

// Update filter options
function updateFilterOptions() {
  const leadSelect = document.getElementById('filter-project-lead');
  const currentValue = leadSelect.value;
  
  // Get unique project leads
  const leads = [...new Set(projects.map(p => p.lead).filter(Boolean))].sort();
  
  // Clear and rebuild options
  leadSelect.innerHTML = '<option value="">All Project Leads</option>';
  leads.forEach(lead => {
    const option = document.createElement('option');
    option.value = lead;
    option.textContent = lead;
    if (lead === currentValue) {
      option.selected = true;
    }
    leadSelect.appendChild(option);
  });
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  const messageEl = document.getElementById('snackbar-message');
  messageEl.textContent = message;
  snackbar.classList.add('show');
  
  setTimeout(() => {
    snackbar.classList.remove('show');
  }, 3000);
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.handleDeleteClick = handleDeleteClick;

