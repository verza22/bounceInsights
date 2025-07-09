import { create } from 'zustand';
import { formatDate } from '../../utils/utils';

const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

interface DateStore {
  dateFrom: string;
  dateTo: string;
  updateDateFrom: (newDate: string) => void;
  updateDateTo: (newDate: string) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  dateFrom: formatDate(sevenDaysAgo),
  dateTo: formatDate(today),
  updateDateFrom: (newDate) => set({ dateFrom: newDate }),
  updateDateTo: (newDate) => set({ dateTo: newDate }),
}));