import { NEXT_PUBLIC_AGENT_API_URL, NEXT_PUBLIC_AGENT_ID } from "../config";

export type TextResponse = {
  text: string;
  user: 'user' | 'Fuse Network';
  action?: string;
  hash?: string;
  [key: string]: unknown;
};

export async function sendMessage(text: string): Promise<TextResponse[]> {
  try {
    const response = await fetch(`${NEXT_PUBLIC_AGENT_API_URL}/api/${NEXT_PUBLIC_AGENT_ID}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        userId: "user", // You might want to get this from your auth system
        roomId: `default-room-${NEXT_PUBLIC_AGENT_ID}`, // You can implement room management later
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
} 