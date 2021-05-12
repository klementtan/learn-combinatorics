import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function getAll() {
  return request(REACT_BACKEND_HOST + '/api/v1/users/all', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function queryCurrent() {
  return request(REACT_BACKEND_HOST + '/api/v1/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function updateProfile(user) {
  return request(REACT_BACKEND_HOST + '/api/v1/users', {
    method: 'PUT',
    data: user,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function verifyNusEmailRequest(nus_email) {
  return request(REACT_BACKEND_HOST + '/api/v1/users/otp/send', {
    method: 'POST',
    data: nus_email,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function verifyOtp(otp) {
  return request(REACT_BACKEND_HOST + '/api/v1/users/otp/verify', {
    method: 'POST',
    data: otp,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}

export async function updateRoles(roles, userId) {
  return request(REACT_BACKEND_HOST + `/api/v1/users/${userId}/roles`, {
    method: 'PUT',
    data: roles,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('learn-combinatorics-token')}`,
    },
  });
}
