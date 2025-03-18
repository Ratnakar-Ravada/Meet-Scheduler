import axios from "axios";

export const fetchAuthSession = async () => {
  const response = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/auth/session`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );

  if (response && Object.keys(response.data).length > 0) {
    return response.data;
  } else {
    return null;
  }
};
