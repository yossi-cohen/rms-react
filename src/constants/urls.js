import urljoin  from 'url-join';

export const baseUrl = 'http://localhost:3000';
export const getVideoList = urljoin(baseUrl, '/api/videos');
export const postVideoSearch = urljoin(baseUrl, '/api/search');
