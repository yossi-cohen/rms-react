import urljoin from 'url-join';

import config from '../../config.js'

export const baseUrl = 'http://' + config.host + ':' + config.port;
export const getVideoList = urljoin(baseUrl, '/api/videos');
export const postVideoSearch = urljoin(baseUrl, '/api/search');
