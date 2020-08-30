export type IndexedCollection<T> = {
    [key: string]: T;
}

export interface HeadlessParser {
    async parse: (data: HeadlessInput) => Promise<HeadlessOutput>
}

export interface HeadlessOutputItem {
    id: number | string,
    success: boolean, // whether page couldn't be loaded
    result: string,
    targets: HeadlessOutputItemTarget[] | [],
}

export interface HeadlessOutputItemTarget {
    scope: string,
    result: string,
    success: boolean
}

export interface HeadlessOutput {
    data: {}, // for misc data like execution time
    items: HeadlessOutputItem[]
}

export interface HeadlessInputItemTarget {
    scope: string,
    selector: string,
    timeout?: number
}

export interface HeadlessInputItem {
    id: number | string,
    url: string,
    timeout?: number, // page timeout (if can't reach within x ms)
    targets?: HeadlessInputItemTarget[] // batched targets (multiple selectors) on the same URL
}

export interface HeadlessInput {
    data: {} // for misc data like general timeout, base url etc.
    items: HeadlessInputItem[]
}
