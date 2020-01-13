import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-soketio';
  form: FormGroup;
  messages: Array<{message:String}> = []

  constructor(
    private wsService: WebsocketService,
    private formBuilder: FormBuilder,
  ) {}

  ngAfterViewInit() {

  }
  ngOnInit(): void {
    this.wsService.listen('test event').subscribe((data) => {
      console.log(data);
    });
    this.wsService.listen('new message').subscribe((data: any) => {
      this.messages.push(data);
    });

    this.initialForm();
  }

  initialForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [ Validators.required ] ],
      message: ['', [ Validators.required ] ],
    });
  }

  sendMessage(): void {
    this.wsService.emit('send message', this.form.value);
    this.form.reset();
  }
}
