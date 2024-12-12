import axios from 'axios';

// Assuming your backend is running on localhost:3000, adjust as needed
const BASE_URL = '/api';

interface SubscribeParams {
  token: string;
  topic: string;
}

interface SendNotificationParams {
  token?: string;
  title: string;
  message: string;
  link?: string;
}

interface ChannelNotificationParams {
  channel: string;
  title: string;
  body: string;
}

interface DeviceNotificationParams {
  token: string;
  title: string;
  body: string;
}

class NotificationsHttpClient {
  // Subscribe to a topic
  static async subscribe(params: SubscribeParams) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/subscribe`, params);
      return response.data;
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  }

  // Unsubscribe from a topic
  static async unsubscribe(params: SubscribeParams) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/unsubscribe`, params);
      return response.data;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      throw error;
    }
  }

  // Send a notification to a specific device
  static async sendNotification(params: SendNotificationParams) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/send`, params);
      return response.data;
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }

  // Send a notification to a specific channel
  static async notifyChannel(params: ChannelNotificationParams) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/channel`, params);
      return response.data;
    } catch (error) {
      console.error('Channel notification error:', error);
      throw error;
    }
  }

  // Send a notification to all users
  static async notifyAll(params: { title: string; body: string }) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/all`, params);
      return response.data;
    } catch (error) {
      console.error('All users notification error:', error);
      throw error;
    }
  }

  // Notify about a new channel
  static async notifyNewChannel(params: { channelName: string }) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/new-channel`, params);
      return response.data;
    } catch (error) {
      console.error('New channel notification error:', error);
      throw error;
    }
  }

  // Send a notification to a specific device
  static async notifyDevice(params: DeviceNotificationParams) {
    try {
      const response = await axios.post(`${BASE_URL}/notifications/device`, params);
      return response.data;
    } catch (error) {
      console.error('Device notification error:', error);
      throw error;
    }
  }
}

export default NotificationsHttpClient;
