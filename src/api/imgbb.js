// src/api/imgbb.js
import axios from "axios";

const API_KEY = "d9696d0c8cbfc32d6c7095902c37958f";

export const uploadImageToImgbb = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
  return res.data.data.url;
};
