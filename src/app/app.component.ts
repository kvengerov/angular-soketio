import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-soketio';
  form: FormGroup;
  messages: Array<{message:String}> = []
  subscriptions: SubscriptionLike[] = [];

  constructor(
    private wsService: WebsocketService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.wsService.listen('new message').subscribe((data: any) => {
        this.messages.push(data);
      })
    );
    this.initialForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
