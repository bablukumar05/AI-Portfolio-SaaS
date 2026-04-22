import API from "./api";

export const getBlogs = () => API.get("/blogs");
export const addBlog = (data) => API.post("/blogs", data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);