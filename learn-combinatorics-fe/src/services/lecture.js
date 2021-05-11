import request from '@/utils/request';

export async function createLecture(payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures`, {
    method: 'POST',
    data: payload,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function getAllLectures() {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function updatePosition(lectureId, delta) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}/positions`, {
    method: 'POST',
    data: {
      delta: delta,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function deleteLecture(lectureId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function getLecture(lectureId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function updateLecture(lectureId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'PUT',
    data: payload,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
