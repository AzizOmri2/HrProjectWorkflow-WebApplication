import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private message: string | null = null;
  private messageType: 'success' | 'error' | null = null;

  
  setMessage(type: 'success' | 'error', text: string) {
    // Store the message in localStorage
    localStorage.setItem('flash_message', JSON.stringify({ type, text }));
  }

  getMessage() {
    // Retrieve the message from localStorage
    const msg = JSON.parse(localStorage.getItem('flash_message') || 'null');
    localStorage.removeItem('flash_message'); // Clear after retrieving
    return msg;
  }
}