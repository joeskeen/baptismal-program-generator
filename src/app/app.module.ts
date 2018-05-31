import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { JsPdfFactory } from './lib/jspdf.library';
import { PDFJS, PDFJS_TOKEN } from './lib/pdfjs.library';
import { MOMENT_API, MOMENT_TOKEN } from './lib/moment.library';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    JsPdfFactory,
    // { provide: PDFJS_TOKEN, useValue: PDFJS },
    { provide: MOMENT_TOKEN, useValue: MOMENT_API }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
