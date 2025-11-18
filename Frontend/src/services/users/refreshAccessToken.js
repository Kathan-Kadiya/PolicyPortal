// import axios from "axios";

// const refreshAccessToken = async () => {
//     const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/refresh-access-token`;
//     const token = localStorage.getItem("accessToken");
//     console.log(`inside users refreshaccesstoken`);
//     if (!token) {
//         console.error("Access token not found");
//         // window.location.reload();
//         return;
//     }

//     try {
//         const response = await axios.get(
//             BACKEND_URL,
//             { withCredentials: true }
//         );
//         localStorage.setItem("accessToken", response.data.data.accessToken);
//         console.log("Access token refreshed successfully");
//         return response.data.data.accessToken;
//     } catch (error) {
//         console.error("Error refreshing access token:", error);
//         // window.location.reload();
//     }
// };


// export default refreshAccessToken;

// refreshAccessToken.js
import axios from "axios";

const REFRESH_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/refresh-access-token`;

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw new Error("No refresh token in localStorage");
      }

      const resp = await axios.post(REFRESH_URL, { refreshToken }, { withCredentials: false });
      const newAccess = resp?.data?.data?.accessToken;
      const newRefresh = resp?.data?.data?.refreshToken;

      if (!newAccess) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        throw new Error("No access token in refresh response");
      }

      localStorage.setItem("accessToken", newAccess);
      if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
      return newAccess;
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export default refreshAccessToken;
