

export async function fetchFinal() {
  return request('/api/PMS/event/final-staff');
}

export async function fetchBuckle(params) {
  return request('/api/event-logs', {
    method: 'GET',
    body: params,
  });
}

export async function buckleInfo(id) {
  return request(`/api/event-logs/${id}`);
}

export async function withdrawBuckle(id) {
  return request(`/api/event-logs/${id}/withdraw`, {
    method: 'PUT',
  });
}

export async function addBuckle(params) {
  return request('/api/event-logs/event', {
    method: 'POST',
    body: params,
  });
}
