import api from "./api";

export const savePortfolio = (data) => api.post("/portfolio", data);
export const getPortfolio = () => api.get("/portfolio");
