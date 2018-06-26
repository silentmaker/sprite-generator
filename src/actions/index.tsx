import * as constants from '../constants';
import { SpriteImage } from "../components/SpriteGenerator/SpriteGenerator";

export interface SetAlignStyle {
    type: constants.SET_ALIGN_STYLE;
    style: string;
}
export interface SetImagePadding {
    type: constants.SET_IMAGE_PADDING;
    padding: number
}
export interface AddImage {
    type: constants.ADD_IMAGE;
    images: SpriteImage[];
}
export interface RemoveImage {
    type: constants.REMOVE_IMAGE;
    index: number;
}
export interface MoveImage {
    type: constants.MOVE_IMAGE;
    oldIndex: number;
    newIndex: number;
}
export interface ReplaceImage {
    type: constants.REPLACE_IMAGE;
    index: number;
    image: SpriteImage;
}

export interface ClearImage {
    type: constants.CLEAR_IMAGE;
}

export type GeneratorActions = SetAlignStyle | SetImagePadding | AddImage | RemoveImage | MoveImage | ReplaceImage | ClearImage;

export function setAlignStyle(style: string): SetAlignStyle {
    return {
        style,
        type: constants.SET_ALIGN_STYLE,
    };
}
export function setImagePadding(padding: number): SetImagePadding {
    return {
        padding,
        type: constants.SET_IMAGE_PADDING,
    };
}
export function addImage(images: SpriteImage[]): AddImage {
    return {
        images,
        type: constants.ADD_IMAGE
    };
}
export function removeImage(index: number): RemoveImage {
    return {
        index,
        type: constants.REMOVE_IMAGE
    };
}
export function moveImage(oldIndex: number, newIndex: number): MoveImage {
    return {
        oldIndex,
        newIndex,
        type: constants.MOVE_IMAGE
    }
}
export function replaceImage(index: number, image: SpriteImage): ReplaceImage {
    return {
        index,
        image,
        type: constants.REPLACE_IMAGE
    };
}

export function clearImage():ClearImage {
    return {
        type: constants.CLEAR_IMAGE
    }
}