import * as types from 'constants/ActionTypes'
import initialState from './initialState'

const reducer = (state = initialState.query.geoJson, action) => {
    console.log('lilox: @@@ updateGeoJsonReducer @@@ action:', action);
    switch (action.type) {
        case types.UPDATE_GEO_JSON:
            return {...state, geoJson: action.geoJson };
    }

    return state;
};

export default reducer;
