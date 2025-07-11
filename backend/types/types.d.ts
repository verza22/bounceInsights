type wsType = "apodTitle" | "apodExplanation";

export interface wsMessage {
    type: wsType,
    payload: string
}