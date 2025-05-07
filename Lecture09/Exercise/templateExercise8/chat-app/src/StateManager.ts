import type { User, Chat, Message } from "./types.js";

export const stateEvents = new EventTarget();

export namespace StateManager {
  let _token: string | null = null;
  let _currentUser: User | null = null;
  let _currentChat: Chat | null = null;
  const userMap: Map<string, User> = new Map<string, User>();

  export namespace TokenManager {
    export function setToken(token: string | null) {
      _token = token;

      stateEvents.dispatchEvent(new CustomEvent("token"));
    }

    export function getToken(): string | null {
      return _token;
    }
  }

  export namespace UserManager {
    export function setUser(user: User | null) {
      _currentUser = user;

      stateEvents.dispatchEvent(new CustomEvent("user"));
    }

    export function getUser(): User | null {
      return _currentUser;
    }
  }

  export namespace ChatManager {
    export function setChatUser(user: User | null): void {
      if (!user) {
        _currentChat = null;

        stateEvents.dispatchEvent(new CustomEvent("chat", { detail: null }));
      } else {
        _currentChat = { user, messages: [] };

        stateEvents.dispatchEvent(new CustomEvent("chat", { detail: user }));
      }
    }

    export function getChatUser(): User | null {
      return _currentChat?.user || null;
    }

    export function addMessage(message: Message): void {
      if (_currentChat) {
        _currentChat.messages = [..._currentChat.messages, message];
      }

      stateEvents.dispatchEvent(new CustomEvent("message"));
    }

    export function addMessages(messages: Message[]): void {
      if (_currentChat) {
        _currentChat.messages = [..._currentChat.messages, ...messages];
        console.log(_currentChat.messages);
      }

      stateEvents.dispatchEvent(new CustomEvent("message"));
    }

    export function clearMessages(): void {
      if (_currentChat) {
        _currentChat.messages = [];
      }

      stateEvents.dispatchEvent(new CustomEvent("message"));
    }

    export function getMessages(): Message[] | null {
      return _currentChat?.messages || null;
    }
  }

  export namespace UserRegistry {
    export function setUsers(users: User[]): void {
      userMap.clear();
      users.forEach((user) => {
        userMap.set(user.id.toString(), user);
      });

      stateEvents.dispatchEvent(new CustomEvent("userreg"));
    }

    export function getUser(userId: string): User | null {
      return userMap.get(userId) || null;
    }
  }
}
