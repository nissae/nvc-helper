/**
 * NVC Companion App
 * A tool for practicing Non-Violent Communication
 */

(function () {
    'use strict';

    // Storage key for localStorage
    const STORAGE_KEY = 'nvc_companion_entries';

    // DOM Elements
    const elements = {
        // Tabs
        tabBtns: document.querySelectorAll('.tab-btn'),
        inputSection: document.getElementById('input-section'),
        historySection: document.getElementById('history-section'),

        // Form
        nvcForm: document.getElementById('nvc-form'),
        observationInput: document.getElementById('observation'),
        feelingInput: document.getElementById('feeling'),
        needInput: document.getElementById('need'),
        requestInput: document.getElementById('request'),
        clearBtn: document.getElementById('clear-btn'),

        // History
        historyList: document.getElementById('history-list'),
        emptyState: document.getElementById('empty-state'),
        exportJsonBtn: document.getElementById('export-json-btn'),
        exportTextBtn: document.getElementById('export-text-btn'),
        clearAllBtn: document.getElementById('clear-all-btn'),

        // Modal
        editModal: document.getElementById('edit-modal'),
        editForm: document.getElementById('edit-form'),
        editId: document.getElementById('edit-id'),
        editObservation: document.getElementById('edit-observation'),
        editFeeling: document.getElementById('edit-feeling'),
        editNeed: document.getElementById('edit-need'),
        editRequest: document.getElementById('edit-request'),
        modalClose: document.getElementById('modal-close'),
        cancelEditBtn: document.getElementById('cancel-edit-btn'),

        // Toast
        toast: document.getElementById('toast')
    };

    // State
    let entries = [];

    /**
     * Initialize the application
     */
    function init() {
        loadEntries();
        setupEventListeners();
        renderHistory();
    }

    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Tab navigation
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Form submission
        elements.nvcForm.addEventListener('submit', handleFormSubmit);
        elements.clearBtn.addEventListener('click', clearForm);

        // Quick Add buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-add-btn')) {
                handleQuickAdd(e.target);
            }
        });

        // History actions
        elements.exportJsonBtn.addEventListener('click', exportAsJson);
        elements.exportTextBtn.addEventListener('click', exportAsText);
        elements.clearAllBtn.addEventListener('click', clearAllEntries);

        // Modal
        elements.modalClose.addEventListener('click', closeModal);
        elements.cancelEditBtn.addEventListener('click', closeModal);
        elements.editForm.addEventListener('submit', handleEditSubmit);
        elements.editModal.addEventListener('click', (e) => {
            if (e.target === elements.editModal) closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.editModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /**
     * Switch between tabs
     */
    function switchTab(tab) {
        elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        if (tab === 'input') {
            elements.inputSection.classList.add('active');
            elements.historySection.classList.remove('active');
        } else {
            elements.inputSection.classList.remove('active');
            elements.historySection.classList.add('active');
            renderHistory();
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const entry = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            observation: elements.observationInput.value.trim(),
            feeling: elements.feelingInput.value.trim(),
            need: elements.needInput.value.trim(),
            request: elements.requestInput.value.trim()
        };

        entries.unshift(entry);
        saveEntries();
        clearForm();
        showToast('Entry saved successfully!', 'success');
    }

    /**
     * Clear the input form
     */
    function clearForm() {
        elements.nvcForm.reset();
        elements.observationInput.focus();
    }

    /**
     * Handle Quick Add button clicks
     */
    function handleQuickAdd(button) {
        const field = button.dataset.field;
        const value = button.dataset.value;

        // Get the corresponding textarea element
        let textarea;
        switch (field) {
            case 'observation':
                textarea = elements.observationInput;
                break;
            case 'feeling':
                textarea = elements.feelingInput;
                break;
            case 'need':
                textarea = elements.needInput;
                break;
            case 'request':
                textarea = elements.requestInput;
                break;
            default:
                return;
        }

        // Add the value to the textarea
        if (textarea.value.trim() === '') {
            // If empty, just set the value
            textarea.value = value;
        } else {
            // If not empty, append with comma
            textarea.value = textarea.value.trim() + ', ' + value;
        }

        // Focus the textarea
        textarea.focus();
    }

    /**
     * Load entries from localStorage
     */
    function loadEntries() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            entries = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading entries:', error);
            entries = [];
        }
    }

    /**
     * Save entries to localStorage
     */
    function saveEntries() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving entries:', error);
            showToast('Error saving entry. Storage may be full.', 'error');
        }
    }

    /**
     * Generate a unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Render the history list
     */
    function renderHistory() {
        if (entries.length === 0) {
            elements.historyList.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');
        elements.historyList.innerHTML = entries.map(entry => createEntryHTML(entry)).join('');

        // Add event listeners to entry buttons
        elements.historyList.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });

        elements.historyList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
        });
    }

    /**
     * Create HTML for a single entry
     */
    function createEntryHTML(entry) {
        const date = new Date(entry.timestamp);
        const formattedDate = formatDate(date);

        return `
            <article class="history-entry">
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <div class="entry-actions">
                        <button class="btn-edit" data-id="${entry.id}">Edit</button>
                        <button class="btn-delete" data-id="${entry.id}">Delete</button>
                    </div>
                </div>
                <div class="entry-content">
                    <div class="entry-field">
                        <span class="entry-field-label">👁️ Observation</span>
                        <p class="entry-field-value">${escapeHtml(entry.observation)}</p>
                    </div>
                    <div class="entry-field">
                        <span class="entry-field-label">💭 Feeling</span>
                        <p class="entry-field-value">${escapeHtml(entry.feeling)}</p>
                    </div>
                    <div class="entry-field">
                        <span class="entry-field-label">🌱 Need</span>
                        <p class="entry-field-value">${escapeHtml(entry.need)}</p>
                    </div>
                    <div class="entry-field">
                        <span class="entry-field-label">🤝 Request</span>
                        <p class="entry-field-value">${escapeHtml(entry.request)}</p>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Format date for display
     */
    function formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Open the edit modal
     */
    function openEditModal(id) {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;

        elements.editId.value = entry.id;
        elements.editObservation.value = entry.observation;
        elements.editFeeling.value = entry.feeling;
        elements.editNeed.value = entry.need;
        elements.editRequest.value = entry.request;

        elements.editModal.classList.add('active');
        elements.editObservation.focus();
    }

    /**
     * Close the edit modal
     */
    function closeModal() {
        elements.editModal.classList.remove('active');
        elements.editForm.reset();
    }

    /**
     * Handle edit form submission
     */
    function handleEditSubmit(e) {
        e.preventDefault();

        const id = elements.editId.value;
        const index = entries.findIndex(e => e.id === id);

        if (index === -1) return;

        entries[index] = {
            ...entries[index],
            observation: elements.editObservation.value.trim(),
            feeling: elements.editFeeling.value.trim(),
            need: elements.editNeed.value.trim(),
            request: elements.editRequest.value.trim()
        };

        saveEntries();
        renderHistory();
        closeModal();
        showToast('Entry updated successfully!', 'success');
    }

    /**
     * Delete an entry
     */
    function deleteEntry(id) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        entries = entries.filter(e => e.id !== id);
        saveEntries();
        renderHistory();
        showToast('Entry deleted.', 'success');
    }

    /**
     * Clear all entries
     */
    function clearAllEntries() {
        if (entries.length === 0) {
            showToast('No entries to clear.', 'error');
            return;
        }

        if (!confirm('Are you sure you want to delete ALL entries? This cannot be undone.')) return;

        entries = [];
        saveEntries();
        renderHistory();
        showToast('All entries cleared.', 'success');
    }

    /**
     * Export entries as JSON
     */
    function exportAsJson() {
        if (entries.length === 0) {
            showToast('No entries to export.', 'error');
            return;
        }

        const data = JSON.stringify(entries, null, 2);
        downloadFile(data, 'nvc-entries.json', 'application/json');
        showToast('Exported as JSON!', 'success');
    }

    /**
     * Export entries as text
     */
    function exportAsText() {
        if (entries.length === 0) {
            showToast('No entries to export.', 'error');
            return;
        }

        const text = entries.map(entry => {
            const date = new Date(entry.timestamp);
            return `
=== NVC Entry - ${formatDate(date)} ===

OBSERVATION:
${entry.observation}

FEELING:
${entry.feeling}

NEED:
${entry.need}

REQUEST:
${entry.request}

-------------------------------------------
            `.trim();
        }).join('\n\n');

        downloadFile(text, 'nvc-entries.txt', 'text/plain');
        showToast('Exported as text!', 'success');
    }

    /**
     * Download a file
     */
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Show a toast notification
     */
    function showToast(message, type = 'success') {
        elements.toast.textContent = message;
        elements.toast.className = 'toast ' + type;

        // Trigger reflow for animation (void to satisfy linter)
        void elements.toast.offsetHeight;

        elements.toast.classList.add('show');

        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
