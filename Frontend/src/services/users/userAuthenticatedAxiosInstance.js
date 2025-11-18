// import axios from "axios";
// import refreshAccessToken from "./refreshAccessToken";

// const createAxiosInstance = (endpoint, setIsUserLoggedIn) => {
//     const axiosInstance = axios.create({
//         baseURL: `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
//         withCredentials: true,
//         credentials: "include",
//         // headers: {
//         //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         // },        
//     });

//     axiosInstance.interceptors.response.use(
//         response => response,
//         async error => {
//             if (error.response?.status === 403) {
//                 const newAccessToken = await refreshAccessToken(setIsUserLoggedIn);
//                 if (newAccessToken) {
//                     return axiosInstance.request(error.config);
//                 }
//                 localStorage.removeItem("accessToken");
//             }

//             return Promise.reject(error);
//         }
//     );

//     return axiosInstance;
// };

// export default createAxiosInstance;

// userAuthenticatedAxiosInstance.js
import axios from "axios";
import refreshAccessToken from "./refreshAccessToken";

const createAxiosInstance = (endpoint = "") => {
  const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
    withCredentials: false,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      if (originalRequest._retry) return Promise.reject(error);
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshAccessToken();
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          return instance.request(originalRequest);
        } catch (refreshErr) {
          // refresh failed -> clear tokens and propagate error so UI can redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;


