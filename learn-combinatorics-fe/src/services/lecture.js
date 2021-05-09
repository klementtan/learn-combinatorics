import request from '@/utils/request';

export async function createLecture(payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures`, {
    method: 'POST',
    data: payload,
  });
}
export async function getAllLectures() {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures`, {
    method: 'GET',
  });
}

export async function updatePosition(lectureId, delta) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}/positions`, {
    method: 'POST',
    data: {
      delta: delta,
    },
  });
}

export async function deleteLecture(lectureId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'DELETE',
  });
}
export async function getLecture(lectureId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'GET',
  });
}
export async function updateLecture(lectureId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/lectures/${lectureId}`, {
    method: 'PUT',
    data: payload,
  });
}
