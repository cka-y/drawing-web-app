export enum KeyboardCode {
    Backspace = 'Backspace',
    Escape = 'Escape',
    PencilToolSelector = 'KeyC',
    BucketToolSelector = 'KeyB',
    LineToolSelector = 'KeyL',
    RectangleToolSelector = 'Digit1',
    EllipseToolSelector = 'Digit2',
    EraserToolSelector = 'KeyE',
    CreateNewDrawingSelector = 'ctrl+KeyO',
    RectangleSelectionSelector = 'KeyR',
    SelectAllCanvas = 'ctrl+KeyA',
    SprayPaintToolSelector = 'KeyA',
    UndoSelector = 'ctrl+KeyZ',
    RedoSelector = 'ctrl+shift+KeyZ',
    SaveDrawingSelector = 'ctrl+KeyS',
    ExportDrawingSelector = 'ctrl+KeyE',
    CarrouselSelector = 'ctrl+KeyG',
    ArrowRight = 'ArrowRight',
    ArrowLeft = 'ArrowLeft',
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    PolygonalLassoToolSelector = 'KeyV',
    GridDisplaySelector = 'KeyG',
    GridIncSquareSizeSelector1 = 'NumpadAdd',
    GridIncSquareSizeSelector2 = 'shift+Equal',
    GridIncSquareSizeSelector3 = 'Equal',
    GridDecSquareSizeSelector1 = 'NumpadSubtract',
    GridDecSquareSizeSelector2 = 'Minus',
    StampToolSelector = 'KeyD',
    Copy = 'ctrl+KeyC',
    Paste = 'ctrl+KeyV',
    Cut = 'ctrl+KeyX',
    Delete = 'Delete',
}

export const PREVENT_DEFAULT_REQ_KEYS: KeyboardCode[] = [
    KeyboardCode.SelectAllCanvas,
    KeyboardCode.SelectAllCanvas,
    KeyboardCode.UndoSelector,
    KeyboardCode.RedoSelector,
    KeyboardCode.SaveDrawingSelector,
    KeyboardCode.ExportDrawingSelector,
    KeyboardCode.CarrouselSelector,
    KeyboardCode.CreateNewDrawingSelector,
    KeyboardCode.ArrowUp,
    KeyboardCode.ArrowDown,
];
