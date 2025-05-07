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

export type Chat = {
  user: User;
  messages: Message[];
};
