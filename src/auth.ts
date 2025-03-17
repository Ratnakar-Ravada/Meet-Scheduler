import axios from 'axios';

export const fetchAuthSession = async () => {
    const response = await axios.get(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
        withCredentials: true  // <--- Required to send cookies
      })

    if (response && Object.keys(response.data).length > 0) {
        return response.data;
    }
    else{
        return null;
    }
};
