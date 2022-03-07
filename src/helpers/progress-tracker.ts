import { BehaviorSubject, distinctUntilChanged, filter, map, Observable } from "rxjs";

export class ProgressTracker{

    // For tracking progress
    public processedCount = 0;
    public processedCount$ = new BehaviorSubject<number>(0);
    public progressEmitEvery = 10;   // Emit every 10 %

    public resetProcessedCount(): void{
        this.processedCount = 0;
        this.processedCount$.next(this.processedCount);
    }

    public incrementProcessedCount(): void{
        this.processedCount++;
        this.processedCount$.next(this.processedCount);
    }

    public getProgress(totalCount: number): Observable<string>{
        return this.processedCount$.asObservable().pipe(
            filter(currentCount => currentCount > 0),                                       // Skip 0 %
            map(currentCount => currentCount/totalCount*100),                               // Calculate pct
            map(pct => Math.floor(pct/this.progressEmitEvery)*this.progressEmitEvery),      // Round down
            distinctUntilChanged(),                                                         // Emit only when different from last
            map(pct => `${pct} %`)                                                          // To string
        );
    }

}