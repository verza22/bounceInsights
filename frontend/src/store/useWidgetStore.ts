import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WidgetStore {
    widgets: Widget[],
    removeWidget: (id: number) => void,
    addWidget: (widget: Widget) => void
}

const defaultWidgets: Widget[] = [
    { id: 0, title: "Astronomy Picture of the Day", type: "apod", sizeX: 2, sizeY: 2, row: 0, col: 0 },
    { id: 1, title: "Quiz", type: "quiz", sizeX: 2, sizeY: 2, row: 0, col: 2 },
    { id: 2, title: "Near Earth Object", type: "neo", sizeX: 2, sizeY: 2, row: 2, col: 0 },
    { id: 3, title: "Coronal Mass Ejection", type: "cme", sizeX: 2, sizeY: 2, row: 2, col: 2 },
    { id: 4, title: "GST", type: "gst", sizeX: 2, sizeY: 2, row: 4, col: 0 },
    { id: 5, title: "InSight", type: "insight", sizeX: 2, sizeY: 2, row: 4, col: 2 },
    { id: 6, title: "Curiosity", type: "curiosity", sizeX: 2, sizeY: 2, row: 6, col: 0 },
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
      }),
      {
        name: "widget-storage",
        partialize: (state) => ({ 
            widgets: state.widgets 
        }),
      }
    )
);