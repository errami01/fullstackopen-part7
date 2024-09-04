import axios from "axios";
const baseUrl = "/api/users";

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};
const getById = async (id) => {
  const request = await axios.get(baseUrl);
  return request.data.find((User) => User.id === id);
};
export default { getAll, getById };
