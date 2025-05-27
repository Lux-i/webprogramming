import { Injectable, signal, inject } from '@angular/core';
import { MessagesService } from './messages.service';

const initialLoginStatus = {
  loggedIn: false,
  loginError: false,
  id: '',
  username: '',
  token: '',
};

export type User = {
  id: string;
  name: string;
  group_id: string;
};

export type Message = {
  sender_id: number;
  message: string;
  timestamp: string;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = `http://webp-ilv-backend.cs.technikum-wien.at/messenger`;

  messagesService = inject(MessagesService);

  private _loginStatus = signal(initialLoginStatus);
  public loginStatus = this._loginStatus.asReadonly();

  constructor() {}

  /**
   * logs in and updates signal loginStatus
   * @param username
   * @param password
   * @returns
   */
  async login(username: string, password: string) {
    const url = `${this.apiUrl}/login.php`;
    const formData = new FormData();
    formData.append('username_or_email', username);
    formData.append('password', password);

    const resp = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await resp.json();
    console.log('Login/Registration response:', data);

    if (!data.token) return;
    if (!data.id) return;

    //eigener user ist nicht dabei deswegen geht nicht :(
    //wollte so username ermitteln :(
    /*const usersurl = `${this.apiUrl}/get_users.php?token=${data.token}&id=${data.id}`;
    const usersresp = await fetch(usersurl, {
      method: 'GET',
    });
    const usersdata = await usersresp.json();
    const user = usersdata.find((user: any) => user.id == data.id);*/

    this._loginStatus.set({
      loggedIn: true,
      loginError: false,
      id: data.id,
      username: username,
      token: data.token,
    });
  }

  /**
   * logs out and updates signal loginStatus
   */
  logout() {
    this._loginStatus.set(initialLoginStatus);
  }

  async getUsers(): Promise<null | User[]> {
    const logindata = this.loginStatus();
    if (!logindata.loggedIn) return null;
    const url = `${this.apiUrl}/get_users.php?token=${logindata.token}&id=${logindata.id}`;
    const resp = await fetch(url);
    return await resp.json();
  }

  async getMessages(user2Id: number) {
    const logindata = this.loginStatus();
    const userId = logindata.id;

    const url = `${this.apiUrl}/get_conversation.php?token=${logindata.token}&user1_id=${userId}&user2_id=${user2Id}`;

    const resp = await fetch(url);
    const data = await resp.json();
    if (Array.isArray(data)) {
      this.messagesService.setMessages(data);
    } else {
      this.messagesService.setMessages([]);
    }
  }
}
