import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect'; // You can use any testing library
import * as actions from 'actions/searchActions';
import * as types from 'constants/ActionTypes';
import { baseUrl } from 'constants/urls'

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const test_res_body = [
    { "id": 1, "title": "Material UI", "data": "video-data-1" },
    { "id": 2, "title": "Elemental UI", "data": "video-data-2" },
    { "id": 3, "title": "Grommet", "data": "video-data-3" },
    { "id": 4, "title": "Mui", "data": "video-data-4" },
    { "id": 5, "title": "Rebass", "data": "video-data-5" }
];

describe('async actions', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('creates FETCH_VIDEOS_SUCCESS when fetching videos has been done', () => {
        nock(baseUrl)
            .get('/api/videos')
            .reply(200, { body: test_res_body });

        const expectedActions = [
            { type: types.FETCH_VIDEOS_REQUEST },
            { type: types.FETCH_VIDEOS_SUCCESS, body: test_res_body }
        ];

        const store = mockStore({ videos: [] });

        return store.dispatch(actions.fetchVideos())
            .then(() => { // return of async actions
                expect(store.getActions()).toEqual(expectedActions)
            });
    });
});
