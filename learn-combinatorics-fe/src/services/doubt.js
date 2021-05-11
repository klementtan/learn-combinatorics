import request from '@/utils/request';

export async function createDoubtThread(doubt) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads`, {
    method: 'POST',
    data: doubt,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function updateDoubtThread(doubt_id, doubt) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads/${doubt_id}`, {
    method: 'PUT',
    data: doubt,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function createDoubtReply(reply) {
  return request(`${REACT_BACKEND_HOST}/api/v1/doubt_threads/replies`, {
    method: 'POST',
    data: reply,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
