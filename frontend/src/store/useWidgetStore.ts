import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WidgetStore {
  widgets: Widget[];
  removeWidget: (id: number) => void;
  addWidget: (widget: Widget) => void;
  updateWidgets: (newWidgets: Widget[]) => void;
}

const defaultWidgets: Widget[] = [
  { id: 0, type: "apod", sizeX: 1, sizeY: 1, row: 1, col: 0 },
  { id: 1, type: "quiz", sizeX: 1, sizeY: 1, row: 1, col: 1 },
  { id: 2, type: "neo", sizeX: 1, sizeY: 1, row: 0, col: 2 },
  { id: 3, type: "cme", sizeX: 1, sizeY: 1, row: 0, col: 0 },
  { id: 4, type: "gst", sizeX: 1, sizeY: 1, row: 0, col: 3 },
  { id: 5, type: "insight", sizeX: 1, sizeY: 1, row: 0, col: 1 },
  { id: 6, type: "curiosity", sizeX: 2, sizeY: 1, row: 1, col: 2 }
];

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      removeWidget: (id: number) =>
        set((state) => ({
          widgets: state.widgets.filter((widget) => widget.id !== id),
        })),
      addWidget: (newWidget: Widget) =>
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        })),
      updateWidgets: (newWidgets: Widget[]) =>
        set({ widgets: newWidgets }),
    }),
    {
      name: "widget-storage",
      partialize: (state) => ({
        widgets: state.widgets,
      }),
    }
  )
);