import axios from 'axios';

export default axios.create({
    baseURL: "https://apricot-hypnotic-share.glitch.me/api",
    headers: {
        'Content-Type': "application/json"
    }
});