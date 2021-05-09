import request from '@/utils/request';

export async function getOrCreateAttempt(problemId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/problems/${problemId}/attempts`, {
    method: 'GET',
  });
}
export async function getAttemptById(attemptId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/${attemptId}`, {
    method: 'GET',
  });
}

export async function getAttempts() {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/user`, {
    method: 'GET',
  });
}

export async function createAttemptSubmission(attemptId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/${attemptId}/submissions`, {
    method: 'POST',
    data: payload,
  });
}

export async function unlockAttemptHint(attemptId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/${attemptId}/unlock_hint`, {
    method: 'POST',
  });
}

export async function unlockAttemptAnswer(attemptId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/${attemptId}/unlock_answer`, {
    method: 'POST',
  });
}

export async function updateAttemptTime(attemptId, time) {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts/${attemptId}/attempt_time`, {
    method: 'PUT',
    data: time,
  });
}
export async function getAllAttemptAdmin() {
  return request(`${REACT_BACKEND_HOST}/api/v1/attempts`, {
    method: 'GET',
  });
}
