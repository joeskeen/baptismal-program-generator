import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { JsPdfFactory, JsPdf } from './lib/jspdf.library';
import { PDFJS_TOKEN, PDFJSStatic, PDFJS } from './lib/pdfjs.library';
import { Moment, MOMENT_TOKEN } from './lib/moment.library';
// TODO: use DI for this
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  baptismalCandidateName = '';
  baptismDate: Date;
  presiding = '';
  conducting = '';
  pianist = '';
  chorister = '';
  openingHymn = '';
  openingPrayer = '';
  baptismTalk = '';
  holyGhostTalk = '';
  musicalSelection = '';
  baptismPerformedBy = '';
  witness1 = '';
  witness2 = '';
  missionaryPresentation = '';
  missionary1 = '';
  missionary2 = '';
  testimony1 = '';
  testimony2 = '';
  closingHymn = '';
  closingPrayer = '';
  confirmationDate: Date;
  confirmationTime: Date;
  confirmationAddress = '';
  confirmationPerformedBy = '';

  private readonly pageWidth = 11;
  private readonly margin = .5;
  private readonly column1Start = this.margin;
  private readonly column1Center = this.pageWidth / 4;
  private readonly column1End = this.pageWidth / 2 - this.margin;
  private readonly column2Start = this.pageWidth / 2 + this.margin;
  private readonly column2Center = this.pageWidth / 4 * 3;
  private readonly column2End = this.pageWidth - this.margin;
  private readonly lineSpacing = .2;

  private pdf: JsPdf;
  @ViewChild('pdfOutputCanvas') pdfOutputCanvas: ElementRef;
  @ViewChild('baptismImage') baptismImage: ElementRef;

  constructor(private jsPDF: JsPdfFactory,
              // TODO: using DI with PDFJS causes an error; need to resolve this
              // @Inject(PDFJS_TOKEN) private pdfJS: PDFJSStatic,
              @Inject(MOMENT_TOKEN) private moment: Moment
            ) {
  }

  private async createPdf() {
    const pdf = this.jsPDF.createPdf('landscape', 'in', 'letter');

    // TODO: get render image to work X|

    let y = this.margin;

    pdf.setFontStyle('bold');
    pdf.setFontSize(14);
    pdf.text(
      `Welcome to the Baptism and Confirmation of\r\n${this.baptismalCandidateName}`,
      this.column2Center, y, 'center');
    y += .5;

    pdf.setFontStyle('normal');
    pdf.setFontSize(11);

    pdf.text(
      this.moment(this.baptismDate).format('dddd, MMMM Do YYYY'),
      this.column2Center, y, 'center');
    y += .5;

    y += this.addProgramLine(pdf, 'Presiding', this.presiding, y);
    y += this.addProgramLine(pdf, 'Conducting', this.conducting, y);
    y += this.addProgramLine(pdf, 'Pianist', this.pianist, y);
    y += this.addProgramLine(pdf, 'Chorister', this.chorister, y);

    y += this.lineSpacing;

    y += this.addProgramLine(pdf, 'Opening Hymn', this.openingHymn, y);
    y += this.addProgramLine(pdf, 'Opening Prayer', this.openingPrayer, y);
    y += this.addProgramLine(pdf, 'Talk - Baptism', this.baptismTalk, y);
    y += this.addProgramLine(pdf, 'Talk - Gift of the Holy Ghost', this.holyGhostTalk, y);
    y += this.addProgramLine(pdf, 'Musical Selection', this.musicalSelection, y);

    y += this.lineSpacing;

    pdf.setFontStyle('bold');
    y += this.addProgramLine(
      pdf,
      `Baptism of\r\n${this.baptismalCandidateName}`,
      [
        `Performed by ${this.baptismPerformedBy}`,
        `Witnessed by ${this.witness1}`,
        `and ${this.witness2}`
      ].join('\r\n'),
      y);

    y += this.lineSpacing;

    y += this.addProgramLine(
      pdf,
      `Presentation - ${this.missionaryPresentation}`,
      `${this.missionary1}\r\n${this.missionary2}`,
      y);

    y += this.addProgramLine(pdf, 'Testimony', this.baptismalCandidateName, y);
    y += this.addProgramLine(pdf, 'Testimony', this.testimony1, y);
    y += this.addProgramLine(pdf, 'Testimony', this.testimony2, y);
    y += this.addProgramLine(pdf, 'Closing Hymn', this.closingHymn, y);
    y += this.addProgramLine(pdf, 'Closing Prayer', this.closingPrayer, y);

    y += this.lineSpacing;

    pdf.text(
      'Refreshments provided by the Relief Society',
      this.column2Center, y, 'center');
    y += this.lineSpacing;

    this.addHr(pdf, y);
    y += this.lineSpacing;

    pdf.setFontSize(10);
    const time = this.moment(this.confirmationTime, 'hh:mm').format('h:mm a');
    pdf.text([
        `Confirmation will take place on ${this.moment(this.confirmationDate).format('dddd, MMMM Do YYYY')}`,
        `at ${time} at the chapel at ${this.confirmationAddress}`,
        `and will be performed by ${this.confirmationPerformedBy}`
      ].join('\r\n'),
      this.column2Center, y, 'center');
    y += this.lineSpacing;

    this.pdf = pdf;

    function lines(text: string) {
      return text.split(/\n/g).length;
    }
  }

  private async getImageDataUri(imageSrc: string): Promise<string> {
    const image = new Image();
    const loadPromise = new Promise(resolve => image.onload = resolve);
    image.src = imageSrc;
    await loadPromise;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  }

  private addProgramLine(pdf: JsPdf, left: string = '', right: string = '', y) {
    pdf.text(
      left,
      this.column2Start, y, 'left');
    pdf.setFontStyle('normal');
    pdf.text(
      right,
      this.column2End, y, 'right');
    return Math.max(
      left.split(/\n/g).length,
      right.split(/\n/g).length)
      * this.lineSpacing;
  }

  private addHr(pdf: JsPdf, y) {
    pdf.rect(this.column2Start, y, this.pageWidth / 2 - 2 * this.margin, .01, 'F');
  }

  async savePdf() {
    await this.createPdf();
    this.pdf.save(`baptismProgram-${this.baptismalCandidateName}.pdf`);
  }

  async renderPdf() {
    await this.createPdf();
    const pdfSource: any = this.pdf.output();

    // Using DocumentInitParameters object to load binary data.
    const pdf = await PDFJS.getDocument({data: pdfSource });

    // Fetch the first page
    const pageNumber = 1;
    const page = await pdf.getPage(pageNumber);

    const scale = 1.5;
    const viewport = page.getViewport(scale);

    // Prepare canvas using PDF page dimensions
    const canvas = this.pdfOutputCanvas.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext);
  }
}
