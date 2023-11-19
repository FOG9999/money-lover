import { Subject } from "rxjs";

export abstract class ComponentDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    destroy(){
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}