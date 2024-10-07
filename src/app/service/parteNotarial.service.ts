import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IChatGTPRequest } from '../models/IChatGTPRequest';
import { catchError, Observable, throwError } from 'rxjs';
import { ModelResponse } from '../response/info-response';
import { ChatGPTBase64, IPlantilla } from '../models/ChatGPTBase64';

@Injectable({
  providedIn: 'root',
})
export class ParteNotarialService {
  
  private baseEndpoint = `${environment.url}parte-notarial/`;

  constructor(
    private http: HttpClient
  ) {}

  public recuperarPdfParteNotarial(mensaje: IChatGTPRequest): Observable<ModelResponse<string>> {
    return this.http
    .post<ModelResponse<string>>(
      `${this.baseEndpoint}obtenerPdf`,
      mensaje
    ).pipe(
    catchError((e) => {
      return throwError(e);
    })
  );
  }

  public consultaSobrePdfUrl(mensaje: ChatGPTBase64): Observable<ModelResponse<string>>{
    return this.http
      .post<ModelResponse<string>>(
        `${this.baseEndpoint}consultaURL`,
        mensaje
      ).pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  
  public generarPlantilla(mensaje: ChatGPTBase64): Observable<string>{
    return this.http
      .post(
        `${this.baseEndpoint}generarPlantilla`,
        mensaje,
        {
          responseType: 'text'
        }
      ).pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  public descargarWord(mensaje: IPlantilla): Observable<Blob> {
    return this.http.post(
      `${this.baseEndpoint}generarWord`,
      mensaje,
      {
        responseType: 'blob'
      }
    ).pipe(
    catchError((e) => {
      return throwError(e);
    })
  );
  }
}
