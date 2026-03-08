import { DataItem } from '../../types/data';
import Papa from 'papaparse';

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: DataItem[], filename: string = 'data-export.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

export const exportToExcel = (data: DataItem[], filename: string = 'data-export.csv') => {
  // Using CSV format for Excel compatibility (removes vulnerable xlsx dependency)
  const csv = Papa.unparse(data);
  const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename.replace('.xlsx', '.csv'));
};

export const exportSelectedToCSV = (data: DataItem[], selectedIds: string[], filename?: string) => {
  const selectedData = data.filter(item => selectedIds.includes(item.id));
  exportToCSV(selectedData, filename);
};

export const exportSelectedToExcel = (data: DataItem[], selectedIds: string[], filename?: string) => {
  const selectedData = data.filter(item => selectedIds.includes(item.id));
  exportToExcel(selectedData, filename);
};
