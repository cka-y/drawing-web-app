import { CircularBuffer } from './circular-buffer';
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('CircularBuffer', () => {
    let circularBuffer: CircularBuffer<number>;
    beforeEach(() => {
        circularBuffer = new CircularBuffer<number>(3);
        circularBuffer['buffer'] = [1, 2, 3];
    });
    it('should create an instance', () => {
        expect(circularBuffer).toBeTruthy();
    });
    it('push should add the element to the correct position', () => {
        circularBuffer['buffer'] = [1, 2, 3];
        circularBuffer['oldestElement'] = 1;
        circularBuffer.push(8);
        expect(circularBuffer['buffer']).toEqual([1, 8, 3]);
    });
    it('next should get the element of the correct position', () => {
        circularBuffer['bufferIterator'] = 0;
        expect(circularBuffer.next()).toEqual(2);
    });
    it('clear should clear the buffer', () => {
        circularBuffer.clear();
        expect(circularBuffer.array).toEqual([]);
    });
    it('forward should shift forward all elements', () => {
        const result: number[] = circularBuffer.forward(circularBuffer.length);
        expect(result).toEqual([2, 3, 1]);
    });
    it('previous should shift backward all elements', () => {
        const result: number[] = circularBuffer.previous(circularBuffer.length);
        expect(result).toEqual([3, 1, 2]);
    });
    it('previous should return empty array if buffer is empty', () => {
        circularBuffer['buffer'] = [];
        const result: number[] = circularBuffer.previous(1);
        expect(result).toEqual([]);
    });
    it('filter filters the buffer', () => {
        circularBuffer.filter((value) => {
            return value === 1;
        });
        expect(circularBuffer.array).toEqual([1]);
    });
    it('pushAll pushes the first elements of the array until we reach maxSize', () => {
        circularBuffer.clear();
        circularBuffer.pushAll([8, 5, 6, 3, 5]);
        expect(circularBuffer.array).toEqual([8, 5, 6]);
    });
    it('incIterator doesnt increment the iterator if the value is negative', () => {
        circularBuffer['bufferIterator'] = 0;
        circularBuffer.incIterator(-3);
        expect(circularBuffer['bufferIterator']).toEqual(0);
    });
    it('includes returns correct value', () => {
        expect(circularBuffer.includes(1)).toBeTrue();
    });
    it('indexOf returns correct value', () => {
        expect(circularBuffer.indexOf(1)).toEqual(0);
    });
    it('delete deletes element if included', () => {
        circularBuffer.delete(1);
        expect(circularBuffer.array).toEqual([2, 3]);
    });
    it('delete does not delete element if not included', () => {
        circularBuffer.delete(8);
        expect(circularBuffer.array).toEqual([1, 2, 3]);
    });
});
