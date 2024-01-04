import axios from "axios";

async function fetchOAuth(access_token: string) {
  if (access_token) {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

export default fetchOAuth;