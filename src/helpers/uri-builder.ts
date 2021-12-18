export function defaultURIBuilder(globalId: string) {
    return `inst:${encodeURIComponent(globalId)}`;
}

export function relativeURIBuilder(globalId: string) {
    return `#${encodeURIComponent(globalId)}`;
}