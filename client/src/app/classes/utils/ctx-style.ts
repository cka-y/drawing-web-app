export abstract class CtxStyle {
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    lineDash: number[];
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;

    static copyCtxStyle(ctx: CanvasRenderingContext2D): CtxStyle {
        return {
            lineWidth: ctx.lineWidth,
            lineCap: ctx.lineCap,
            lineJoin: ctx.lineJoin,
            fillStyle: ctx.fillStyle,
            strokeStyle: ctx.strokeStyle,
            lineDash: ctx.getLineDash(),
            font: ctx.font,
            textAlign: ctx.textAlign,
            textBaseline: ctx.textBaseline,
        };
    }

    static setCtxStyle(ctx: CanvasRenderingContext2D, ctxStyle: CtxStyle): void {
        ctx.lineWidth = ctxStyle.lineWidth;
        ctx.lineJoin = ctxStyle.lineJoin;
        ctx.lineCap = ctxStyle.lineCap;
        ctx.strokeStyle = ctxStyle.strokeStyle;
        ctx.fillStyle = ctxStyle.fillStyle;
        ctx.font = ctxStyle.font;
        ctx.textAlign = ctxStyle.textAlign;
        ctx.textBaseline = ctxStyle.textBaseline;
        ctx.setLineDash(ctxStyle.lineDash);
    }
}

export const DEFAULT_CTX_STYLE: CtxStyle = {
    lineWidth: 1.0,
    lineCap: 'butt',
    lineJoin: 'miter',
    lineDash: [0, 0],
    fillStyle: '#000',
    strokeStyle: '#000',
    font: '20px serif',
    textAlign: 'center',
    textBaseline: 'middle',
};
