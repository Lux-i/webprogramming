// src/ChatUI.ts

import { ApiService } from "./ApiService.js";
import { StateManager, stateEvents } from "./StateManager.js";
const { TokenManager, UserManager, ChatManager, UserRegistry } = StateManager;
import { User } from "./types.js";

export class ChatUI {
  constructor() {
    this.initEventListeners();
    stateEvents.addEventListener("token", async () => {
      // 3) Get Users
      this.handleGetUsers();
    });

    stateEvents.addEventListener("chat", async (e) => {
      //detail is null or user
      const eventData = (e as CustomEvent).detail;
      const chatElement = document.getElementById("chat") as HTMLElement;
      if (!eventData) {
        chatElement.hidden = true;
      } else {
        chatElement.hidden = false;
        const messages = await ApiService.getMessages();
        ChatManager.clearMessages();
        ChatManager.addMessages(messages);
      }
    });

    stateEvents.addEventListener("message", async () => {
      //clear messages
      const messagesElement = document.getElementById(
        "messages"
      ) as HTMLElement;
      messagesElement.innerHTML = "";
      //get messages
      const messages = ChatManager.getMessages();
      console.log(messages);
      if (messages) {
        messages.forEach((message) => {
          //build elements
          const messageContainer = document.createElement("section");
          messageContainer.classList.add("messageContainer");
          let username: string = "";
          if (String(message.sender_id) === String(UserManager.getUser()?.id)) {
            messageContainer.classList.add("message-sent");
            username = UserManager.getUser()?.name as string;
          } else {
            messageContainer.classList.add("message-received");
            username = UserRegistry.getUser(String(message.sender_id))
              ?.name as string;
          }

          const messageElement = document.createElement("section");
          messageElement.classList.add("message");

          const messageUser = document.createElement("p");
          messageUser.classList.add("timestamp"); //egal erfüllt seinen Zweck
          messageUser.innerHTML = username;

          const messageText = document.createElement("p");
          messageText.innerHTML = message.message;

          const messageTime = document.createElement("p");
          messageTime.classList.add("timestamp");
          messageTime.innerHTML = message.timestamp;

          //append elements
          messageElement.appendChild(messageUser);
          messageElement.appendChild(messageText);
          messageElement.appendChild(messageTime);
          messageContainer.appendChild(messageElement);
          messagesElement.appendChild(messageContainer);
        });
      }
      const chatElement = document.getElementById("chat") as HTMLElement;
      chatElement.scrollTo({
        top: chatElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  private initEventListeners() {
    // 1) Registration
    const regForm = document.getElementById("registerForm");
    if (regForm) {
      regForm.addEventListener("submit", async (event) =>
        this.handleRegister(event)
      );
    }

    // 2) Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) =>
        this.handleLogin(event)
      );
    }

    // 4) Send Message
    const sendForm = document.getElementById("sendForm");
    if (sendForm) {
      sendForm.addEventListener("submit", async (event) =>
        this.handleSendMessage(event)
      );
    }

    const userList = document.getElementById("user-list");
    if (userList) {
      userList.addEventListener("click", async (event) => {
        const userElement = event.target as HTMLElement;
        const userId = userElement.dataset.userid;
        if (!userId) return;

        const user = UserRegistry.getUser(userId);
        if (!user) return;

        ChatManager.setChatUser(user);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Task 1: Handle Register
  // --------------------------------------------------------------------------
  private async handleRegister(event: Event) {
    event.preventDefault();
    const regResultDiv = document.getElementById("registerResult");

    const name = (
      document.getElementById("regName") as HTMLInputElement
    ).value.trim();
    const email = (
      document.getElementById("regEmail") as HTMLInputElement
    ).value.trim();
    const pass = (
      document.getElementById("regPass") as HTMLInputElement
    ).value.trim();
    const group = (
      document.getElementById("regGroup") as HTMLInputElement
    ).value.trim();

    try {
      if (regResultDiv) regResultDiv.textContent = "Registering ...";
      const response = await ApiService.registerUser(name, email, pass, group);

      if (response.success) {
        if (regResultDiv) {
          regResultDiv.textContent = `Registration successful! New user ID: ${response.id}`;
        }
        // Optionally reset form
        (event.target as HTMLFormElement).reset();
      } else {
        if (regResultDiv) {
          regResultDiv.textContent = `Registration failed: ${
            response.error || "Unknown error"
          }`;
        }
      }
    } catch (err) {
      console.error("handleRegister Error:", err);
      if (regResultDiv) regResultDiv.textContent = "Network or server error.";
    }
  }

  // --------------------------------------------------------------------------
  // Task 2: Handle Login
  // --------------------------------------------------------------------------
  private async handleLogin(event: Event) {
    event.preventDefault();
    const loginResultDiv = document.getElementById("loginResult");

    const usernameOrEmail = (
      document.getElementById("loginUser") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("loginPass") as HTMLInputElement
    ).value.trim();

    try {
      if (loginResultDiv) loginResultDiv.textContent = "Logging in ...";
      const response = await ApiService.loginUser(usernameOrEmail, password);
      if (response.token) {
        // Save the token in StateManager
        TokenManager.setToken(response.token);
        if (response.id) {
          UserManager.setUser({ name: "You", id: response.id, group_id: "0" });
        }

        if (loginResultDiv) {
          loginResultDiv.textContent = `Login successful!`;
        }
        (event.target as HTMLFormElement).reset();
      } else {
        if (loginResultDiv) {
          loginResultDiv.textContent = `Login failed: ${
            response.error || "Unknown error"
          }`;
        }
      }
    } catch (err) {
      console.error("handleLogin Error:", err);
      if (loginResultDiv)
        loginResultDiv.textContent = "Network or server error.";
    }
  }

  // --------------------------------------------------------------------------
  // Task 3: Get Users
  // --------------------------------------------------------------------------
  private async handleGetUsers() {
    const usersList = document.getElementById("user-list");
    if (usersList) usersList.innerHTML = "Loading users...";

    try {
      const data = await ApiService.getUsers();
      // data can be either an array of User or an {error: string}
      if (Array.isArray(data)) {
        // success
        UserRegistry.setUsers(data);
        if (usersList) {
          usersList.innerHTML = "";
          data.forEach((user: User) => {
            const p = document.createElement("p");
            p.textContent = `${user.name} (ID: ${user.id})`;
            p.dataset.userid = user.id;
            usersList.appendChild(p);
          });
        }
      } else {
        // data is an object with `error` property
        if (usersList) {
          usersList.innerHTML = `Error: ${data.error}`;
        }
      }
    } catch (err) {
      console.error("handleGetUsers Error:", err);
      if (usersList)
        usersList.innerHTML = "Network or server error while loading users.";
    }
  }

  // --------------------------------------------------------------------------
  // Task 4: Send Message
  // --------------------------------------------------------------------------
  private async handleSendMessage(event: Event) {
    console.log("sending message");
    event.preventDefault();
    const sendResultDiv = document.getElementById("sendResult");

    const senderId = UserManager.getUser()?.id;
    const receiverId = ChatManager.getChatUser()?.id;
    console.log(`senderId: ${senderId} | receiverId: ${receiverId}`);
    if (!senderId || !receiverId) return;
    const message = (
      document.getElementById("messageText") as HTMLInputElement
    ).value.trim();

    console.log("all values set");

    try {
      if (sendResultDiv) sendResultDiv.textContent = "Sending message ...";
      const response = await ApiService.sendMessage(
        senderId,
        receiverId,
        message
      );
      if (response.success) {
        //the date is set here so the message the user sends can be added to the chat without reloading
        //but it will be wrong
        //could be replaced with calling getMessages
        const messages = await ApiService.getMessages();
        ChatManager.clearMessages();
        ChatManager.addMessages(messages);

        if (sendResultDiv)
          sendResultDiv.textContent = "Message successfully sent!";
        (event.target as HTMLFormElement).reset();
      } else {
        if (sendResultDiv) {
          sendResultDiv.textContent = `Error: ${
            response.error || "Unknown error"
          }`;
        }
      }
    } catch (err) {
      console.error("handleSendMessage Error:", err);
      if (sendResultDiv)
        sendResultDiv.textContent =
          "Network or server error while sending message.";
    }
  }
}
