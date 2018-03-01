export interface Countdown {
    playing: "pause" | "stop" | "play";
    value: number;
}
export declare const initialState: Countdown;
