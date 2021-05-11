import request from '@/utils/request';

export async function createChapter(payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters`, {
    method: 'POST',
    data: payload,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function getAllChapters() {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function updatePosition(chapterId, delta) {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters/${chapterId}/positions`, {
    method: 'POST',
    data: {
      delta: delta,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function deleteChapter(chapterId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters/${chapterId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function getChapter(chapterId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters/${chapterId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function updateChapter(chapterId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/chapters/${chapterId}`, {
    method: 'PUT',
    data: payload,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
