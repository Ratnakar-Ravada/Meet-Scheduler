import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

export const fetchAuthSession = async () => {
  const response = await client.get("/api/auth/session");

  if (response && Object.keys(response.data).length > 0) {
    return response.data;
  } else {
    return null;
  }
};
