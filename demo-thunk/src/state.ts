

export interface Counter {
    loading: boolean;
    value: number
}

export const initialState: Counter = {
    value: 0, loading: false
}