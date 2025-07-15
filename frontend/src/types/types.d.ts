type WidgetType = "apod" | "cme" | "curiosity" | "gst" | "insight" | "neo" | "quiz";
type wsType = "apodTitle" | "apodExplanation";

interface Widget {
    id: number,
    title: string,
    type: WidgetType,
    sizeX: number,
    sizeY: number,
    row: number,
    col: number
}

declare module '*.png' {
    const value: string;
    export default value;
  }