import axios from 'axios';

const API_KEY = 'MdvoWYTibrqdZufj5h3CKWmzxVq4mKxOZmi2DILw';
const BASE_URL = 'https://api.nasa.gov';

export const getAstronomyPictureOfTheDay = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/planetary/apod?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
};
