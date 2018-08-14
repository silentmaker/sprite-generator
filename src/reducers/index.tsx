import * as constants from '../constants/index';
import { GeneratorActions } from '../actions/index';
import { StoreState } from '../types/index';

export function reducer(state: StoreState, action: GeneratorActions): StoreState {
    switch(action.type) {
        case constants.SET_ALIGN_STYLE:
            return { ...state, alignStyle: action.style };
        case constants.SET_IMAGE_PADDING:
            return { ...state, imagePadding: action.padding };
        case constants.SET_IMAGE_SIZE:
            return { ...state, imageSize: action.size };
        case constants.ADD_IMAGE:
            return { ...state, originalImages: state.originalImages.concat(action.images) };
        case constants.REMOVE_IMAGE:
            return { ...state, originalImages: [
                ...state.originalImages.slice(0, action.index), 
                ...state.originalImages.slice(action.index+1)
            ]};
        case constants.REPLACE_IMAGE:
            return { ...state, originalImages: [
                ...state.originalImages.slice(0, action.index),
                action.image,
                ...state.originalImages.slice(action.index+1)
            ]};
        case constants.MOVE_IMAGE:
            const tmpImages = state.originalImages.slice();
            const movingImage = tmpImages.splice(action.oldIndex, 1)[0];

            tmpImages.splice(action.newIndex, 0, movingImage);
            return { ...state, originalImages: tmpImages};
        case constants.CLEAR_IMAGE:
            return { ...state, originalImages: [] };
    }
    return state;
}