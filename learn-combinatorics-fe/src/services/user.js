import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function getAll() {
  return request(REACT_BACKEND_HOST + '/api/v1/users/all');
}
export async function queryCurrent() {
  return request(REACT_BACKEND_HOST + '/api/v1/users');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function updateProfile(user) {
  return request(REACT_BACKEND_HOST + '/api/v1/users', {
    method: 'PUT',
    data: user,
  });
}

export async function verifyNusEmailRequest(nus_email) {
  return request(REACT_BACKEND_HOST + '/api/v1/users/otp/send', {
    method: 'POST',
    data: nus_email,
  });
}

export async function verifyOtp(otp) {
  return request(REACT_BACKEND_HOST + '/api/v1/users/otp/verify', {
    method: 'POST',
    data: otp,
  });
}

export async function updateRoles(roles, userId) {
  return request(REACT_BACKEND_HOST + `/api/v1/users/${userId}/roles`, {
    method: 'PUT',
    data: roles,
  });
}
