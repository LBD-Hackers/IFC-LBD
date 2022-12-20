import { BehaviorSubject, Observable } from "rxjs";
export declare class ProgressTracker {
    processedCount: number;
    processedCount$: BehaviorSubject<number>;
    progressEmitEvery: number;
    resetProcessedCount(): void;
    incrementProcessedCount(): void;
    getProgress(totalCount: number): Observable<string>;
}
