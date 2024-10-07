import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SanitizeHtmlPipe } from '../utils/sanitize-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SanitizeHtmlPipe,
    FormularioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    NgxSpinnerModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
