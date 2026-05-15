export const appStyles = /* css */`
body {
  font-family: var(--font-sans);
  background: var(--gray-1);
  padding: var(--size-4);
  max-width: 600px;
  margin: 0 auto;
}

.htmx-indicator {
  opacity: 0;
  transition: opacity var(--speed-2) ease-in;
}

.htmx-request .htmx-indicator {
  opacity: 1;
}

.container {
  background: var(--gray-0);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  overflow: visible;
}

.app-header {
  background: var(--gray-0);
  padding: var(--size-4);
  border-bottom: var(--border-size-2) solid var(--blue-6);
  position: sticky;
  top: 0;
  z-index: var(--layer-5);
  border-start-start-radius: var(--radius-3);
  border-start-end-radius: var(--radius-3);
  box-shadow: var(--shadow-2);
}

.title {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  margin: 0;
  color: var(--gray-9);
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
  padding: var(--size-5) var(--size-2);
}

.page-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
}

.section-title {
  color: var(--gray-8);
  font-size: var(--font-size-2);
  font-weight: var(--font-weight-7);
  line-height: var(--font-lineheight-1);
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-2);
}

.stat {
  background: var(--gray-2);
  padding: var(--size-3);
  border-radius: var(--radius-2);
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  color: var(--gray-7);
  margin-bottom: var(--size-1);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
}

.stat-value {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-7);
  color: var(--gray-9);
}

.form-section {
  background: var(--blue-6);
  padding: var(--size-4);
  color: var(--gray-0);
  border-radius: var(--radius-2);
}

.input-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.input-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
}

input[type="number"] {
  padding: var(--size-2);
  border: var(--border-size-2) solid var(--gray-3);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  text-align: center;
  width: 100%;
  background: var(--gray-0);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--blue-6);
  box-shadow: var(--shadow-2);
}

button {
  padding: var(--size-2) var(--size-4);
  background: var(--gray-0);
  color: var(--blue-6);
  border: none;
  border-radius: var(--radius-2);
  font-weight: var(--font-weight-7);
  cursor: pointer;
  font-size: var(--font-size-1);
  transition: background var(--speed-2);
}

button:hover {
  background: var(--gray-2);
}

button:active {
  transform: scale(0.98);
}

.empty-state {
  text-align: center;
  padding: var(--size-10) var(--size-4);
  color: var(--gray-6);
  font-size: var(--font-size-2);
}

.table-container {
  background: var(--gray-9);
  border-radius: var(--radius-2);
  overflow: hidden;
  --walks-table-columns: minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(3.5rem, 0.8fr) minmax(4rem, 1fr) minmax(5rem, 1fr) minmax(3.25rem, 0.65fr);
}

.walks-table {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.walks-table thead,
.walks-table tbody {
  display: block;
  scrollbar-gutter: stable;
}

.walks-table tbody {
  max-height: clamp(16rem, calc(100vh - 360px), 34rem);
  overflow-y: auto;
}

.walks-row {
  display: grid;
  grid-template-columns: var(--walks-table-columns);
  align-items: center;
  width: 100%;
}

.walks-table th {
  padding: var(--size-2);
  background: var(--gray-9);
  text-align: center;
  color: var(--gray-0);
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-1);
  text-transform: uppercase;
  letter-spacing: var(--font-letterspacing-2);
  box-shadow: 0 var(--border-size-1) 0 var(--gray-7);
}

.walks-table td {
  border-bottom: var(--border-size-1) solid var(--gray-7);
}

.walks-table tbody tr:last-child td {
  border-bottom: 0;
}

.walks-table tbody tr {
  background: var(--gray-8);
}

.walks-table tbody tr:hover {
  background: var(--gray-7);
}

.delete-btn {
  padding: var(--size-1) var(--size-2);
  background: var(--red-6);
  color: var(--gray-0);
  border: none;
  border-radius: var(--radius-2);
  cursor: pointer;
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  transition: background var(--speed-2);
}

.delete-btn:hover {
  background: var(--red-7);
}

.walks-cell {
  text-align: center;
  padding: var(--size-2);
  color: var(--gray-0);
}
`;
