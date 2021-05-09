import request from '@/utils/request';

export async function createDoubtThread(doubt) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads`, {
    method: 'POST',
    data: doubt,
  });
}
export async function updateDoubtThread(doubt_id, doubt) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads/${doubt_id}`, {
    method: 'PUT',
    data: doubt,
  });
}

export async function createDoubtReply(reply) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads/replies`, {
    method: 'POST',
    data: reply,
  });
}
