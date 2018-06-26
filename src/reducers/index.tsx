import * as constants from '../constants/index';
import { GeneratorActions } from '../actions/index';
import { StoreState } from '../types/index';

export function reducer(state: StoreState, action: GeneratorActions): StoreState {
    switch(action.type) {
        case constants.SET_ALIGN_STYLE:
            return { ...state, alignStyle: action.style };
        case constants.SET_IMAGE_PADDING:
            return { ...state, imagePadding: action.padding };
        case constants.ADD_IMAGE:
            return { ...state, originalImages: state.originalImages.concat(action.images) };
        case constants.REMOVE_IMAGE:
            return { ...state, originalImages: state.originalImages.splice(action.index, 1) };
        case constants.REPLACE_IMAGE:
            return { ...state, originalImages: state.originalImages.splice(action.index, 1, action.image) };
        case constants.MOVE_IMAGE:
            const movingImage = state.originalImages.splice(action.oldIndex, 1);
            return { ...state, originalImages: state.originalImages.splice(action.newIndex, 0, movingImage[0]) };
    }
    return state;
}