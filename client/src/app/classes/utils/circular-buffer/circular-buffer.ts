const INIT_BUFFER_POSITION = -1;
type FilterCallBack<T> = (value: T, index: number, array: T[]) => boolean;
export class CircularBuffer<T> {
    private buffer: T[];
    private oldestElement: number;
    private bufferIterator: number;

    constructor(private maxSize: number = 1000) {
        this.buffer = new Array<T>(this.maxSize);
        this.oldestElement = 0;
        this.bufferIterator = INIT_BUFFER_POSITION;
    }

    push(element: T): void {
        this.buffer[this.oldestElement] = element;
        this.oldestElement = (this.oldestElement + 1) % this.maxSize;
    }

    delete(element: T): void {
        if (!this.buffer.includes(element)) return;
        this.buffer.splice(this.buffer.indexOf(element), 1);
    }

    next(): T {
        this.incIterator();
        return this.buffer[this.bufferIterator];
    }

    incIterator(value: number = 1): void {
        while (value > 0) {
            this.bufferIterator = (this.bufferIterator + 1) % this.length;
            value--;
        }
    }

    includes(element: T): boolean {
        return this.array.includes(element);
    }

    indexOf(element: T): number {
        return this.array.indexOf(element);
    }

    get length(): number {
        return this.array.length;
    }

    clear(): void {
        this.buffer = new Array<T>(this.maxSize);
    }

    get array(): T[] {
        return this.buffer.filter((element) => {
            return element != null;
        });
    }

    pushAll(elements: T[]): void {
        elements.forEach((value) => {
            if (this.length < this.maxSize) this.push(value);
        }, this);
    }

    filter(callBackFun: FilterCallBack<T>): void {
        this.buffer = this.buffer.filter(callBackFun);
    }

    forward(nbOfElement: number): T[] {
        const arr = this.array;
        arr.push.apply(arr, arr.splice(0, 1));
        this.clear();
        this.pushAll(arr);
        return arr.slice(0, nbOfElement);
    }

    previous(nbOfElement: number): T[] {
        const lastElement: T | undefined = this.array.pop();
        if (!lastElement) return [];
        this.delete(lastElement);
        this.buffer.unshift(lastElement);
        return this.array.slice(0, nbOfElement);
    }

    getFirstElement(nbOfElement: number): T[] {
        return this.array.slice(0, nbOfElement);
    }
}
