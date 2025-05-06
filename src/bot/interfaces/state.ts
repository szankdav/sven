export interface State {
    name: string,
    next(): Promise<void | null>,
}