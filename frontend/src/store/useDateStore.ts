import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatDate } from '../utils/utils';

const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

interface DateStore {
  dateFrom: string;
  dateTo: string;
  updateDateFrom: (newDate: string) => void;
  updateDateTo: (newDate: string) => void;
}

export const useDateStore = create<DateStore>()(
  persist(
    (set) => ({
      dateFrom: formatDate(sevenDaysAgo),
      dateTo: formatDate(today),
      updateDateFrom: (newDate) => set({ dateFrom: newDate }),
      updateDateTo: (newDate) => set({ dateTo: newDate }),
    }),
    {
      name: 'date-storage',
      partialize: (state) => ({
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
      }),
    }
  )
);