/**
 * OMNIA — Shared API client (axios)
 * - Reads REACT_APP_BACKEND_URL from .env
 * - Automatically sends Accept-Language header from current i18n lang
 * - Centralised place to add auth token (M1.S3)
 */
import axios from "axios";
import i18n from "../i18n/config";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language || "it";
  // Always send cookies (for httpOnly auth cookies)
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    // Centralised error logging — extend in later milestones
    if (process.env.NODE_ENV !== "production") {
      console.error("[OMNIA API]", error?.response?.status, error?.message);
    }
    return Promise.reject(error);
  }
);
