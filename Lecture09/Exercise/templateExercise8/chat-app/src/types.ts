export type User = {
  id: string;
  name: string;
  group_id: string;
};

export type Message = {
  sender: User;
  receiver: User;
  message: string;
  timestamp: number;
};

export type Chat = {
  user: User;
  messages: Message[];
};
