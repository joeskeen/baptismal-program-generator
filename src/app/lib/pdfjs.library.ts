import { InjectionToken } from '@angular/core';
import { PDFJSStatic as pdfjsstatic } from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist/webpack';

export const PDFJS_TOKEN = new InjectionToken('PDFJS');
export const PDFJS: pdfjsstatic = pdfjs;
export type PDFJSStatic = pdfjsstatic;
