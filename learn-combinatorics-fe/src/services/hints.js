import request from '@/utils/request';

export async function createHint(payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints`, {
    method: 'POST',
    data: payload,
  });
}
export async function getAllHints() {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints`, {
    method: 'GET',
  });
}

export async function updatePosition(hintId, delta) {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints/${hintId}/positions`, {
    method: 'POST',
    data: {
      delta: delta,
    },
  });
}

export async function deleteHint(hintId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints/${hintId}`, {
    method: 'DELETE',
  });
}
export async function getHint(hintId) {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints/${hintId}`, {
    method: 'GET',
  });
}
export async function updateHint(hintId, payload) {
  return request(`${REACT_BACKEND_HOST}/api/v1/hints/${hintId}`, {
    method: 'PUT',
    data: payload,
  });
}
export async function upsertHintPdf(hintId, pdf) {
  var bodyFormData = new FormData();
  bodyFormData.append('hint_body_pdf', pdf);
  return request(REACT_BACKEND_HOST + `/api/v1/hints/${hintId}/hint_body_pdf`, {
    method: 'PUT',
    data: bodyFormData,
  });
}

export async function upsertHintVideo(hintId, video) {
  var bodyFormData = new FormData();
  bodyFormData.append('video', video);
  return request(REACT_BACKEND_HOST + `/api/v1/hints/${hintId}/hint_video`, {
    method: 'PUT',
    data: bodyFormData,
  });
}
