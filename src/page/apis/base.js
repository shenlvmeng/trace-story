import axios from 'axios';
import Cookies from 'js-cookie';

const defaultContentType = 'application/x-www-form-urlencoded;charset=UTF-8';

const client = axios.create({
    timeout: 5000,
    headers: { 'x-csrf-token': Cookies.get('csrfToken') }
});

client.interceptors.response.use((res) => {
    if (res.status === 200) {
        return res.data;
    }
    return Promise.reject(res);
});

client.defaults.headers.post['Content-Type'] = defaultContentType;

export default client;
