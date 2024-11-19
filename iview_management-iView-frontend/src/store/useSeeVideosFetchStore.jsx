// useSeeVideosStore.js
import axios from 'axios';
import create from 'zustand';

// .env dosyasındaki VITE_API_URL'i kullan
const API_URL = import.meta.env.VITE_API_URL;

const useSeeVideosStore = create((set) => ({
  videoData: [],

  fetchVideo: async (formId) => {
    try {
      const response = await axios.get(`${API_URL}/api/videos/${formId}`);
      const videos = await Promise.all(
        response.data.map(async (video) => {
          // Request presigned URL for each video
          const presignedUrlResponse = await axios.get(`${API_URL}/api/presigned-url/${video.videoKey}`);
          return {
            candidateId: video.candidateId,
            uploadDate: video.uploadDate,
            presignedUrl: presignedUrlResponse.data.presignedUrl,
          };
        })
      );
      set({ videoData: videos });
    } catch (error) {
      console.error("Error fetching video URLs:", error);
    }
  },
}));

export default useSeeVideosStore;
