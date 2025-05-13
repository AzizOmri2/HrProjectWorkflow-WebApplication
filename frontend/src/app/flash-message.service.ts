import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private message: string | null = null;
  private messageType: 'success' | 'error' | null = null;

  setMessage(type: 'success' | 'error', text: string) {
    // Store the message in sessionStorage
    sessionStorage.setItem('flash_message', JSON.stringify({ type, text }));
  }

  getMessage() {
    // Retrieve the message from sessionStorage
    const msg = JSON.parse(sessionStorage.getItem('flash_message') || 'null');
    sessionStorage.removeItem('flash_message'); // Clear after retrieving
    return msg;
  }
}