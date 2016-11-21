import urljoin from 'url-join';

export const host = 'localhost';
export const port = 3003;
export const baseUrl = 'http://' + host + ':' + port;
export const getVideoList = urljoin(baseUrl, '/api/videos');
export const postVideoSearch = urljoin(baseUrl, '/api/search');
