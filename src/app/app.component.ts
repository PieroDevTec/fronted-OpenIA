import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatGTPService } from './service/chatGTP.service';
import { IChatGTPRequest } from './models/IChatGTPRequest';
import { IDatosPregunta } from './models/IDatosPregunta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatboot';
}
