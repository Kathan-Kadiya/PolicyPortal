import axios from "axios";
import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";
// const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/schemes`;
const BACKEND_URLV2 = `${process.env.REACT_APP_BACKEND_URL}/api/v2/schemes`;
const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v2/schemes');

// Create axios instance with default config
const api = axios.create({
    baseURL: BACKEND_URLV2,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// export const getFilteredSchemes = async (filters, page = 1, limit = 9) => {
//     try {
//         const params = {
//             page,
//             limit,
//             ...(filters.search && { search: filters.search }),
//             ...(filters.schemeName && { schemeName: filters.schemeName }),
//             ...(filters.openDate && { openDate: filters.openDate }),
//             ...(filters.closeDate && { closeDate: filters.closeDate }),
//             ...(filters.state && { state: filters.state }),
//             ...(filters.nodalMinistryName && { nodalMinistryName: filters.nodalMinistryName }),
//             ...(filters.level && { level: filters.level }),
//             ...(filters.category && { category: filters.category }),
//             ...(filters.gender && { gender: filters.gender }),
//             ...(filters.incomeGroup && { incomeGroup: filters.incomeGroup })
//         };

//         const { data } = await api.get('/get-filtered-schemes', { params });
//         return {
//             schemes: data.schemes,
//             totalPages: data.totalPages,
//             currentPage: data.currentPage,
//             totalSchemes: data.totalSchemes
//         };
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };

// services/schemes/schemeService.js — replace getFilteredSchemes
export const getFilteredSchemes = async (filters = {}, page = 1, limit = 9) => {
  try {
    // Helper to convert arrays to comma-separated strings
    const toCsv = (v) => {
      if (!v && v !== 0) return undefined;
      if (Array.isArray(v)) return v.map(x => x).join(',');
      return String(v).trim();
    };

    const params = {
      page,
      limit,
      ...(filters.search && { search: toCsv(filters.search) }),
      ...(filters.schemeName && { schemeName: toCsv(filters.schemeName) }),
      ...(filters.openDate && { openDate: toCsv(filters.openDate) }),
      ...(filters.closeDate && { closeDate: toCsv(filters.closeDate) }),
      ...(filters.state && { state: toCsv(filters.state) }),
      // send nodalMinistryName as string (could be object.label from UI)
      ...(filters.nodalMinistryName && { nodalMinistryName: toCsv(
        typeof filters.nodalMinistryName === 'object' ? filters.nodalMinistryName.label || filters.nodalMinistryName.value : filters.nodalMinistryName
      ) }),
      ...(filters.level && { level: toCsv(filters.level) }),
      // UI may send 'category' or 'schemeCategory' — include both
      ...(filters.category && { category: toCsv(filters.category) }),
      ...(filters.schemeCategory && { category: toCsv(filters.schemeCategory) }),
      // tags can be array or csv
      ...(filters.tags && { tags: toCsv(filters.tags) }),
      // Map eligibility -> eligibilityDescription (frontend uses 'eligibility' but backend expects eligibilityDescription_md)
      ...(filters.eligibility && { eligibility: toCsv(filters.eligibility) }),
      // If you collect gender/incomeGroup in UI, send them too (but ensure schema has them)
      ...(filters.gender && { gender: toCsv(filters.gender) }),
      ...(filters.incomeGroup && { incomeGroup: toCsv(filters.incomeGroup) })
    };

    // Remove undefined keys
    Object.keys(params).forEach(k => (params[k] === undefined) && delete params[k]);

    const { data } = await api.get('/get-filtered-schemes', { params });
    return {
      schemes: data.schemes,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalSchemes: data.totalSchemes
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getAllSchemes = async (page = 1, limit = 9) => {
    try {
        const { data } = await api.get('/get-all-schemes', {
            params: { page, limit }
        });
        return {
            schemes: data.schemes,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            totalSchemes: data.totalSchemes
        };
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSchemeById = async (id) => {
    try {
        const { data } = await api.get(`/get-scheme-by-id/${id}`);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const saveFavoriteSchemes = async (schemeId) => {
    try {
        const response = await userAxiosInstance.post('/save-favorite-schemes', { schemeId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeFavoriteSchemes = async (schemeId) => {
    try {
        const response = await userAxiosInstance.delete(`/remove-favorite-schemes/${schemeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFavoriteSchemes = async () => {
    try {
        const response = await userAxiosInstance.get('/get-favorite-schemes');
        return response.data;
    } catch (error) {
        throw error;
    }
};