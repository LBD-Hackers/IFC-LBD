export function defaultURIBuilder(globalId: string) {
    return `inst:${encodeURIComponent(globalId)}`;
}