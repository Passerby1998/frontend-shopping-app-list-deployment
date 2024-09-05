import axios from "axios";

// PUBLIC API

export function postApi(url, data) {
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getApi(url) {
  return axios.get(url);
}

// PROTECTED API

export function getApiWithToken(url, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function postApiWithToken(url, data, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteApiWithToken(url, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putApiWithToken(url, data, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return axios.put(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
