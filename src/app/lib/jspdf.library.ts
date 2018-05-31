import { Injectable } from '@angular/core';
import 'html2canvas';
import 'rasterizehtml';
import * as jspdf from 'jspdf';
const jsPDF: typeof JsPdf = jspdf;

@Injectable()
export class JsPdfFactory {
    createPdf(orientation?: Orientation | IJsPdfOptions, unit?: Unit, format?: PageSize): JsPdf {
        return new jsPDF(orientation, unit, format);
    }
    get global() { return jsPDF; }
}

export declare class JsPdf {
    constructor(orientationOrOptions?: Orientation | IJsPdfOptions,
        unit?: Unit,
        format?: PageSize);
    lines(lines: Array<number[]>, x: number, y: number, scale: number[], style: string): JsPdf;
    rect(x: number, y: number, w: number, h: number, style: string): JsPdf;
    text(text: string, x: number, y: number, flags?: any): JsPdf;
    setFontStyle(style: string): JsPdf;
    setFontSize(size: number): JsPdf;
    save(filename: string): JsPdf;
    output(): string;
    output(type: string, options?: any): JsPdf;
    getFontList();

    addImage(image: any, imageType: string, x: number, y: number, w: number, h: number, alias?: string);
    addImage(alias: string, x: number, y: number, w: number, h: number);
    addHTML(...args: any[]);
}

type Orientation = 'portrait' | 'p' | 'landscape' | 'l';
type Unit = 'pt' | 'mm' | 'cm' | 'in';
type PageSize = 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'a10'
    | 'b0' | 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' | 'b9' | 'b10'
    | 'c0' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10'
    | 'dl'
    | 'letter' | 'government-letter' | 'legal' | 'junior-legal' | 'ledger' | 'tabloid' | 'credit-card'
    | [number, number];

interface IJsPdfOptions {
    orientation: Orientation;
    unit: Unit;
    format: PageSize;
    hotfixes: string[];
}
