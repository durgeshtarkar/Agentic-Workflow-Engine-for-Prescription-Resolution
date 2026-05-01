import axios from 'axios';

const fallbackHost = `${window.location.protocol}//${window.location.hostname}:8005/api/v1`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || fallbackHost;

console.log('[API] baseURL', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const prescriptionService = {
  process: async (rawText: string, targetLanguage: string = "English") => {
    const response = await api.post('/prescriptions/process', { 
      raw_text: rawText,
      patient_id: "DEMO-USER-001",
      target_language: targetLanguage
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/prescriptions/history');
    return response.data;
  },
  upload: async (file: File, targetLanguage: string = "English") => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', targetLanguage);
    const response = await api.post('/prescriptions/upload', formData);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/prescriptions/${id}/status`, { status });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },
  chat: async (prescriptionId: string, agentRole: string, question: string) => {
    const response = await api.post('/prescriptions/chat', {
      prescription_id: prescriptionId,
      agent_role: agentRole,
      question
    });
    return response.data;
  },
  updateProfile: async (fullName: string, currentPassword?: string, newPassword?: string) => {
    const response = await api.post('/auth/update-profile', {
      full_name: fullName,
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },
  lookupDrug: async (name: string, targetLanguage: string = "English") => {
    const response = await api.get(`/drugs/lookup?name=${encodeURIComponent(name)}&lang=${encodeURIComponent(targetLanguage)}`);
    return response.data;
  },
  getPatientTimeline: async (patientName: string) => {
    const response = await api.get(`/prescriptions/timeline/${encodeURIComponent(patientName)}`);
    return response.data;
  }
};

export default api;
