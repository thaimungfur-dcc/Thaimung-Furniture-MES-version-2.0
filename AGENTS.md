# Agent Instructions and Best Practices

## UI/UX Best Practices

1. **SweetAlert2 for Error Handling**:
   - Always use `sweetalert2` for displaying error or success messages from the API/Backend to the user. This ensures a clean, consistent, and user-friendly experience instead of native `window.alert()`.
   - Example `Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' })`.

2. **Loading States**:
   - Because calls to Google Sheets/Apps Script can take 1-3 seconds, always implement proper loading states.
   - Use `Loader2` (from `lucide-react`) with an animation (`animate-spin`) on buttons to indicate processing.
   - Disable buttons while loading to prevent duplicate submissions.

3. **Data Validation**:
   - Validate data strictly on the Frontend (React) before sending it to the Google Sheets backend.
   - This reduces unnecessary network requests, improves perceived performance, and decreases load on the Apps Script quota.

## SETTING CONFIG: Shared Components Rules (CRITICAL)

To prevent code duplication, lag, and to make the system highly maintainable, you MUST use the following Centralized Components (Shared Components) and utilities instead of writing custom elements in individual pages:

1. **Data Tables & Pagination (`DataTable.tsx`)**:
   - Do NOT write raw HTML tables (`<table>`, `<thead>`, `<tbody>`) from scratch if it requires pagination, searching, or sorting.
   - ALWAYS use `src/components/shared/DataTable.tsx` (built on `@tanstack/react-table`). It automatically handles:
     - Global Search / Filtering
     - Column Sorting (Ascending/Descending)
     - Pagination
     - CSV Exporting

2. **CSV Bulk Data Upload (`CsvUploadModal.tsx`) & `csvUtils.ts`**:
   - For any "Bulk Add" or CSV upload feature, always import and use `CsvUploadModal` from `src/components/shared/CsvUploadModal.tsx`.
   - It provides drag & drop, PapaParse integration, and a data preview before confirmation.

3. **CSV Exporting (`csvUtils.ts`)**:
   - Use `downloadCSV(data, filename)` from `src/utils/csvUtils.ts` for fast JSON-to-CSV exporting, which natively handles Thai characters (Excel BOM).

4. **Draggable Modals (`DraggableModal.tsx`)**:
   - If a modal needs to be moved around the screen independently (e.g., to look at data behind it), wrap the modal's internal structure with `src/components/shared/DraggableModal.tsx`.

5. **QR Code Generation (`QrCodeGenerator.tsx`)**:
   - Do not rebuild QR code implementations. Use `src/components/shared/QrCodeGenerator.tsx`.

6. **File Segmentation**:
   - Every file created MUST be split into sub-components as needed to keep file size small, ensure fast loading, and avoid lag/crashes. Never write a 1,000+ line monolith component.

## Backend (Google Sheets)
- See `GOOGLE_APPS_SCRIPT.md` for information regarding backend architecture and operations.
