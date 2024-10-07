import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IDatosPregunta } from '../../models/IDatosPregunta';
import { ChatGTPService } from '../../service/chatGTP.service';
import { IChatGTPRequest } from '../../models/IChatGTPRequest';
import { log } from 'console';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatGPTBase64, IPlantilla } from '../../models/ChatGPTBase64';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ParteNotarialService } from '../../service/parteNotarial.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit, AfterViewInit{

  @ViewChild('pdfFrame', {static: false}) pdfFrame!: ElementRef;
  iframeSrc: SafeResourceUrl;
  
  respuesta!: string;
  textoHtml!: string;
  interacciones: IDatosPregunta[] = [];
  content!: HTMLElement;

  form: FormGroup = new FormGroup({
    pregunta: new FormControl(''),
    continuar: new FormControl('')
  });

  constructor(
    private _chatGPTService: ChatGTPService,
    private _parteNotarialService: ParteNotarialService,
    public spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer 
  ) {  
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    this.content = document.getElementById('content-datos') as HTMLElement;
    this.actualizarScroll();
  }
  
  enviarPreguntaSarp(){
    let preguntaUsuario: string = this.form.get('pregunta')?.value;

    let datos: IChatGTPRequest = {
      message: preguntaUsuario
    }

    if (preguntaUsuario.length > 1) {
      
      //Agregar a la lista de preguntas
      this.interacciones.push({
        pregunta: preguntaUsuario
      })

      this.spinner.show();
      this._chatGPTService.obtnerHojaResumenSarp(datos).
      subscribe({
        next: (resp) => {
          
          this.spinner.hide();
          let array: IDatosPregunta | any= this.interacciones.at(-1);

          if (resp.success == 1) {
            this.respuesta = resp.model;
          
            
            array.respuesta = this.respuesta;
            array.tipo = 'pdf'

            // //Insertar pdf
            // const iframe = this.pdfFrame?.nativeElement;
            // console.log('====================================');
            // console.log(iframe);
            // console.log('====================================');
            // const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            // iframeDoc.open();
            // iframeDoc.write(`
            //       <ngx-extended-pdf-viewer [base64Src]="${resp.model}" [useBrowserLocale]="true"></ngx-extended-pdf-viewer>
            // `);
            // iframeDoc.close();


          }else{
            array.respuesta = resp.message;
            array.tipo = 'text';
            
          }
          
          this.actualizarScroll();
          this.form.reset();
        },
        error: (err) => {
          this.respuesta = '';
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          
          this.spinner.hide();
        },
        complete: () => {
          
        }
      });
    }else{
      Swal.fire('Tiene que ingresar un texto para procesar su solicitud', environment.nameSystem, 'info');
    }
  }

  
  recuperarParteNotarial(){
    let preguntaUsuario: string = this.form.get('pregunta')?.value;

    let datos: IChatGTPRequest = {
      message: preguntaUsuario
    }

    if (preguntaUsuario.length > 1) {
      
      //Agregar a la lista de preguntas
      this.interacciones.push({
        pregunta: preguntaUsuario
      })

      this.spinner.show();
      this._parteNotarialService.recuperarPdfParteNotarial(datos).
      subscribe({
        next: (resp) => {
          
          this.spinner.hide();
          let array: IDatosPregunta | any= this.interacciones.at(-1);

          if (resp.success == 1) {
            this.respuesta = resp.model;
            
            //Sanear URL
            array.respuesta = this.sanitizer.bypassSecurityTrustResourceUrl(this.respuesta);
            array.tipo = 'pdf'

            // //Insertar pdf
            // const iframe = this.pdfFrame?.nativeElement;
            // console.log('====================================');
            // console.log(iframe);
            // console.log('====================================');
            // const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            // iframeDoc.open();
            // iframeDoc.write(`
            //       <ngx-extended-pdf-viewer [base64Src]="${resp.model}" [useBrowserLocale]="true"></ngx-extended-pdf-viewer>
            // `);
            // iframeDoc.close();
            console.log(array);
            

          }else{
            array.respuesta = resp.message;
            array.tipo = 'text';
            
          }
          
          this.actualizarScroll();
          this.form.reset();
        },
        error: (err) => {
          this.respuesta = '';
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          
          this.spinner.hide();
        },
        complete: () => {
          
        }
      });
    }else{
      Swal.fire('Tiene que ingresar un texto para procesar su solicitud', environment.nameSystem, 'info');
    }
  }

  preguntaParteNotarial() {

    let preguntaUsuario: string = this.form.get('pregunta')?.value;

    let request : ChatGPTBase64 = {
      textoBase64: this.respuesta,
      pregunta: preguntaUsuario
    }

    //Agregar a la lista de preguntas
    this.interacciones.push({
      pregunta: preguntaUsuario
    })

    this._parteNotarialService.consultaSobrePdfUrl(request).subscribe({
      next: (resp) => {
        if (resp.success == 1) {
        
          let array: IDatosPregunta | any= this.interacciones.at(-1);
          array.respuesta = resp.model;
          array.tipo = 'text'

          this.actualizarScroll();
          this.form.get('pregunta')?.setValue('');

        }else{
          Swal.fire(resp.message, environment.nameSystem,resp.icon);
        }
        
        this.spinner.hide();
      },
      error: (err) => {
        this.respuesta = '';
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        
        this.spinner.hide();
      },
      complete: () => {
        
      }
    });
  }

  generarPlantilla(){
    
    let preguntaUsuario: string = this.form.get('pregunta')?.value;

    let request : ChatGPTBase64 = {
      textoBase64: this.respuesta,
      pregunta: ''
    }

    //Agregar a la lista de preguntas
    this.interacciones.push({
      pregunta: preguntaUsuario
    })

    this.spinner.show();
    this._parteNotarialService.generarPlantilla(request).subscribe({
      next: (text) => {

        this.textoHtml = text;

        let array: IDatosPregunta | any= this.interacciones.at(-1);
        array.respuesta = text;
        array.tipo = 'text'

        this.actualizarScroll();
        this.form.get('pregunta')?.setValue('');

        this.spinner.hide();
      },
      error: (err) => {
        this.respuesta = '';
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        
        this.spinner.hide();
      },
      complete: () => {
        
      }
    });
  }
  
  descargarWord(){
    let request : IPlantilla = {
      texto: this.textoHtml
    }

    this._parteNotarialService.descargarWord(request).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download =  `${new Date().getTime().toString()}_documento.docx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err)=> {
        console.error('Error al generar el documento:', err);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    });
  }

  preguntaBase64Sarp(){
    
    let preguntaUsuario: string = this.form.get('pregunta')?.value;

    let request : ChatGPTBase64 = {
      textoBase64: this.respuesta,
      pregunta: preguntaUsuario
    }

    //Agregar a la lista de preguntas
    this.interacciones.push({
      pregunta: preguntaUsuario
    })

    this._chatGPTService.consultaBase64(request).subscribe({
      next: (resp) => {
        if (resp.success == 1) {
        
          let array: IDatosPregunta | any= this.interacciones.at(-1);
          array.respuesta = resp.model;
          array.tipo = 'text'

          this.actualizarScroll();
          this.form.get('pregunta')?.setValue('');

        }else{
          Swal.fire(resp.message, environment.nameSystem,resp.icon);
        }
        
        this.spinner.hide();
      },
      error: (err) => {
        this.respuesta = '';
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        
        this.spinner.hide();
      },
      complete: () => {
        
      }
    });
  }

  reiniciar(){
    this.form.get('continuar')?.setValue(false);
    this.interacciones = [];
    
  }

  actualizarScroll(){
    this.content.scrollTop  =  this.content.scrollTop + 474;
    console.log('====================================');
    console.log(this.content.scrollHeight);
    console.log(this.content.scrollTop);
    console.log('====================================');
  }
}
