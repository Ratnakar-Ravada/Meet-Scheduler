import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAuthSession = async () => {
  const response = await client.get("/api/auth/session");

  if (response && Object.keys(response.data).length > 0) {
    return response.data;
  } else {
    return null;
  }
};

export const handleAuth = async () => {
  window.location.href = process.env.NEXTAUTH_URL + "/api/auth/signin";
};

// export const handleRequestAdditionalScopes = async () => {
//   try {
//     const response = await client.get("/api/addScopes");
//     const data = await response.data;
//     console.log(data);
//     // Redirect user to Google's consent screen for additional scopes
//     window.location.href = data.authUrl;
//   } catch (error) {
//     console.error("Error requesting additional scopes:", error);
//   }
// };

export const handleLogout = async () => {
  window.location.href = process.env.NEXTAUTH_URL + "/api/auth/signout";
};
