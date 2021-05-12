import request from '@/utils/request';

export async function getAllProblems() {
  return request(REACT_BACKEND_HOST + '/api/v1/problems', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function createProblem(problem) {
  return request(REACT_BACKEND_HOST + '/api/v1/problems', {
    method: 'POST',
    data: problem,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function updateProblem(problemId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/problems/${problemId}`, {
    method: 'PUT',
    data: payload,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function upsertProblemPdf(problemId, pdf) {
  var bodyFormData = new FormData();
  bodyFormData.append('pdf', pdf);
  return request(REACT_BACKEND_HOST + `/api/v1/problems/${problemId}/problem_pdf`, {
    method: 'PUT',
    data: bodyFormData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function createAnswer(answer) {
  return request(REACT_BACKEND_HOST + '/api/v1/answers', {
    method: 'POST',
    data: answer,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function updateAnswer(answerId, answer) {
  return request(REACT_BACKEND_HOST + `/api/v1/answers/${answerId}`, {
    method: 'PUT',
    data: answer,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function upsertExplanationVideo(answerId, explanationVideo) {
  var bodyFormData = new FormData();
  bodyFormData.set('video', explanationVideo);
  return request(REACT_BACKEND_HOST + `/api/v1/answers/${answerId}/explanation_video`, {
    method: 'PUT',
    data: bodyFormData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function upsertExplanationBodyPdf(answerId, explanationPdf) {
  var bodyFormData = new FormData();
  bodyFormData.append('explanation_body_pdf', explanationPdf);
  return request(REACT_BACKEND_HOST + `/api/v1/answers/${answerId}/explanation_body_pdf`, {
    method: 'PUT',
    data: bodyFormData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function updatePosition(problemId, delta) {
  return request(`${REACT_BACKEND_HOST}/api/v1/problems/${problemId}/positions`, {
    method: 'POST',
    data: {
      delta: delta,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function deleteProblem(problemId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/problems/${problemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function getProblem(problemId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/problems/${problemId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
