import type { User, Chat, Message } from "./types.js";

export namespace StateManager {
  let _token: string | null = null;
  let _currentUser: User | null = null;
  let _currentChat: Chat | null = null;

  export namespace TokenManager {
    export function setToken(token: string | null) {
      _token = token;
    }

    export function getToken(): string | null {
      return _token;
    }
  }

  export namespace UserManager {
    export function setUser(user: User | null) {
      _currentUser = user;
    }

    export function getUser(): User | null {
      return _currentUser;
    }
  }

  export namespace ChatManager {
    export function setChatUser(user: User | null): void {
      if (!user) {
        _currentChat = null;
      } else {
        _currentChat = { user, messages: [] };
      }
    }

    export function getChatUser(): User | null {
      return _currentChat?.user || null;
    }

    export function addMessage(message: Message): void {
      if (_currentChat) {
        _currentChat.messages = [..._currentChat.messages, message];
      }
    }

    export function addMessages(messages: Message[]): void {
      if (_currentChat) {
        _currentChat.messages = [..._currentChat.messages, ...messages];
      }
    }

    export function getMessages(): Message[] | null {
      return _currentChat?.messages || null;
    }
  }
}
