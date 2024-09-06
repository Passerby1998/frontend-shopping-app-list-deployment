// PUBLIC API

export function postApi(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function getApi(url) {
  return fetch(url);
}

// PROTECTED API

export async function getApiWithToken(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Check if the response is ok and in the correct format
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json(); // Ensure it returns JSON if expected
}

export function postApiWithToken(url, data, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function deleteApiWithToken(url, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function putApiWithToken(url, data, token) {
  if (!token) {
    return Promise.reject(new Error("No token provided"));
  }
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
