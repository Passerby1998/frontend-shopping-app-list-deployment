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

export const getApiWithToken = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postApiWithToken = async (url, data, token) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

export const deleteApiWithToken = async (url, token) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const putApiWithToken = async (url, data, token) => {
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};
