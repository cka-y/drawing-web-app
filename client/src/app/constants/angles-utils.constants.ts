export const DEG_ANGLE_DIVIDER = 180;
export const DEG_TO_RAD_COEF = Math.PI / DEG_ANGLE_DIVIDER;
export const MAX_ANGLE: number = Math.PI * 2;
export const RADIX = 10;

const ANGLE_DIVIDER = 4;
const ANGLE_INC: number = Math.PI / ANGLE_DIVIDER;
export const NB_ANGLES = 8;
export const QUAD_ANGLES: number[] = [];

for (let i = 0; i < NB_ANGLES; i++) {
    QUAD_ANGLES.push(i * ANGLE_INC);
}
