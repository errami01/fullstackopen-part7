import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blogToUpdate) => {
  const formatedBlog = {
    ...blogToUpdate,
    user: blogToUpdate.user.id,
  };
  const response = await axios.put(
    `${baseUrl}/${formatedBlog.id}`,
    formatedBlog,
  );
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
};
const getById = async (blogId) => {
  const request = await axios.get(baseUrl);
  return request.data.find(blog => blog.id === blogId);
}
export default { getAll, setToken, create, update, remove, getById };
