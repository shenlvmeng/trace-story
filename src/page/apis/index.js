import network from './base';

export default function(query) {
    network.post('/api/trace/generate', query, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
