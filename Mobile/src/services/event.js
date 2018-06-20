
import request from '../utils/request';

export async function getEvent() {
  return request('/api/event-logs/categories');
}
