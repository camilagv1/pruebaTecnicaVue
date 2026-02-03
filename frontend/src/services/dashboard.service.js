import api from "../api/axios";

export const getDocuments = () => api.get("/documents");

export const uploadCsv = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/csv/upload", form);
};

export const downloadCsv = (id) =>
  api.get(`/documents/download/${id}`, { responseType: "blob" });

export const deleteDocument = (id) => api.delete(`/documents/${id}`);
