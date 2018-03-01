

export interface Countdown {
    playing: "pause" | "stop" | "play";
    value: number
}

export const initialState: Countdown = {
    value: 0, playing: "stop"
}