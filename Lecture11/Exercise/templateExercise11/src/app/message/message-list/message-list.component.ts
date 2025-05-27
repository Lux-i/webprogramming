import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessagesService } from '../../messages.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-message-list',
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messagesService = inject(MessagesService);
  apiService = inject(ApiService);
  messages = [
    { sender_id: 0, message: 'Hello there!', timestamp: '0' },
    { sender_id: 1, message: 'Welcome to the messenger app!', timestamp: '1' },
  ];
  users = [
    { id: '0', name: 'alfred', group_id: '6' },
    { id: '1', name: 'nicht alfred', group_id: '6' },
  ];

  ngOnInit() {
    if (this.apiService.loginStatus().loggedIn) {
      this.apiService.getMessages(761).then(() => {
        this.messages = this.messagesService.messages();
      });

      this.apiService.getUsers().then((users) => {
        this.users = users || [];
      });
    }
  }
}
