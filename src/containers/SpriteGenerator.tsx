import { SpriteGenerator, SpriteImage, StateProps, DispatchProps } from "../components/SpriteGenerator/SpriteGenerator";
import * as actions from '../actions/index';
import { StoreState } from '../types/index';
import { connect, Dispatch } from "react-redux";

export function mapStateToProps({ alignStyle, imagePadding, imageSize, originalImages }: StoreState) {
    return {
        images: originalImages,
        padding: imagePadding,
        size: imageSize,
        style: alignStyle
    } 
}

export function mapDispatchToProps(dispatch: Dispatch<actions.GeneratorActions>) {
    return {
        onSetStyle: (style: string) => dispatch(actions.setAlignStyle(style)),
        onSetPadding: (padding: number) => dispatch(actions.setImagePadding(padding)),
        onSetSize: (size: number) => dispatch(actions.SetImageSize(size)),
        onAddImage: (images: SpriteImage[])  => dispatch(actions.addImage(images)),
        onRemoveImage: (index: number) => dispatch(actions.removeImage(index)),
        onMoveImage: (oldIndex: number, newIndex: number) => dispatch(actions.moveImage(oldIndex, newIndex)),
        onReplaceImage: (index: number, image: SpriteImage) => dispatch(actions.replaceImage(index, image)),
        onClearImage: () => dispatch(actions.clearImage())
    }
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(SpriteGenerator);