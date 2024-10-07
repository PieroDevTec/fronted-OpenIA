import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IChatGTPRequest } from '../models/IChatGTPRequest';
import { ModelResponse } from '../response/info-response';
import { ChatGPTBase64 } from '../models/ChatGPTBase64';

@Injectable({
  providedIn: 'root',
})
export class ChatGTPService {
  private baseEndpoint = `${environment.url}openAi/`;

  constructor(private http: HttpClient) {}

  public traducirLenguaje(mensaje: IChatGTPRequest): Observable<any> {
    return this.http
      .post(
        `${this.baseEndpoint}mensajeUsuario`,
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

  public obtnerHojaResumenSarp(mensaje: IChatGTPRequest): Observable<ModelResponse<string>> {
    return this.http
      .post<ModelResponse<string>>(
        `${this.baseEndpoint}buscarHojaResumenSarp`,
        mensaje
      ).pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  
  public consultaBase64(mensaje: ChatGPTBase64): Observable<ModelResponse<string>> {
    return this.http
      .post<ModelResponse<string>>(
        `${this.baseEndpoint}consultaBase64`,
        mensaje
      ).pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }
}
