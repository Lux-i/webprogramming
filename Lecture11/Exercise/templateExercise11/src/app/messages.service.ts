import { Injectable, signal } from '@angular/core';

export type Message = {
  sender_id: number;
  message: string;
  timestamp: string;
};

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _messages = signal<Message[]>([]);
  public messages = this._messages.asReadonly();

  constructor() {}

  setMessages(messages: Message[]) {
    this._messages.set(messages);
  }

  addMessage(message: Message) {
    this._messages.set([...this.messages(), message]);
  }
}
