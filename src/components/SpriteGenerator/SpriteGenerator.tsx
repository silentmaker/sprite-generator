import * as React from 'react';

import './SpriteGenerator.css';
import logo from '../../assets/images/logo.svg';
import * as actions from '../../actions/index';

export interface SpriteImage {
    name: string;
    size: number;
    source: string;
}

export interface State {
    replacingIndex: number;
}

export interface StateProps {
    style: string;
    padding: number;
    images: SpriteImage[];
}

export interface DispatchProps {
    onSetStyle(style: string): actions.SetAlignStyle;
    onSetPadding(padding: number): actions.SetImagePadding;
    onAddImage(images: SpriteImage[]): actions.AddImage;
    onRemoveImage(index: number): actions.RemoveImage;
    onReplaceImage(index: number, image: SpriteImage): actions.ReplaceImage;
    onMoveImage(oldIndex: number, newIndex: number): actions.MoveImage;
    onClearImage(): actions.ClearImage
}

export class SpriteGenerator extends React.Component<StateProps & DispatchProps, State> {
    private fileInput: React.RefObject<HTMLInputElement>
    private replaceInput: React.RefObject<HTMLInputElement>

    constructor(props: StateProps & DispatchProps) {
        super(props);
        this.fileInput = React.createRef();
        this.replaceInput = React.createRef();
        this.activeUpload = this.activeUpload.bind(this);
        this.changeStyle = this.changeStyle.bind(this);
        this.changePadding = this.changePadding.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.clearImage = this.clearImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.replaceImage = this.replaceImage.bind(this);
        this.selectReplaceImage = this.selectReplaceImage.bind(this);
        this.state = {
            replacingIndex: 0
        };
    }
    public activeUpload() {
        if(this.fileInput.current) {
            this.fileInput.current.click();
        }
    }
    public changeStyle(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onSetStyle(event.target.value);
    }
    public changePadding(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onSetPadding(parseInt(event.target.value, 10) || 0);
    }
    public changeImage(event: React.ChangeEvent<HTMLInputElement>) {
        const tmpImages = [];
        if(event.target.files) {
            for (const image of Array.from(event.target.files)) {
                tmpImages.push({
                    name: image.name,
                    size: image.size,
                    source: URL.createObjectURL(image)
                });
            }
        }
        this.props.onAddImage(tmpImages);
        if (this.fileInput.current) {
            this.fileInput.current.value = "";
        }
    }
    public clearImage() {
        this.props.onClearImage();
    }
    public removeImage(event: React.SyntheticEvent<EventTarget>) {
        const target = event.target as HTMLElement;
        if(target.dataset.index) {
            this.props.onRemoveImage(parseInt(target.dataset.index, 10));
        }
    }
    public replaceImage(event: React.SyntheticEvent<EventTarget>) {
        const target = event.target as HTMLElement;
        
        if(this.replaceInput.current) {
            this.replaceInput.current.click();
        }
        if(target.dataset.index) {
            this.setState({
                replacingIndex: parseInt(target.dataset.index, 10)
            });
        }
    }
    public selectReplaceImage(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files) {
            const tmpImage = event.target.files[0];

            this.props.onReplaceImage(this.state.replacingIndex, {
                name: tmpImage.name,
                size: tmpImage.size,
                source: URL.createObjectURL(tmpImage)
            });
        }
        if (this.replaceInput.current) {
            this.replaceInput.current.value = "";
        }
    }
    public render() {
        const { style, padding, images } = this.props;
        const { activeUpload, fileInput, replaceInput, changeStyle, 
            changePadding, changeImage, clearImage, 
            removeImage, replaceImage, selectReplaceImage } = this;
        const styles = ['vertical', 'horizontal', 'vertical_wrapped', 'horizontal_wrapped'];

        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <span className="app-title">Sprite Generator!</span>
                </header>
                <div>
                    <div className="app-form">
                        <label className="app-label" htmlFor="input-align">Align</label>
                        <select id="input-align" value={style} onChange={changeStyle}>
                            {styles.map((alignStyle, index) => 
                                <option key={index} value={alignStyle}>{alignStyle}</option>
                            )}
                        </select>

                        <label className="app-label ml-l" htmlFor="input-padding">Padding</label>
                        <input type="text" id="input-padding" value={padding} onChange={changePadding} />
                    </div>

                    <div className="image-container">
                        <ul className={`image-list image-list__${style}`}>
                            {images.map((image, index) => 
                                <li className="image-item" key={index}>
                                    <img className="image-cover" src={image.source} alt="IMAGE" />
                                    <div className="image-remove" data-index={index} onClick={removeImage}>Delete</div>
                                    <div className="image-replace" data-index={index} onClick={replaceImage}>Replace</div>
                                </li>
                            )}
                        </ul>
                        
                        {images.length && <div className="image-clear" onClick={clearImage}>Clear All</div>}
                        <button className="button" onClick={activeUpload}>UPLOAD</button>
                    </div>

                    <input type="file" name="addImage" className="hidden" accept="images/*" multiple={true} 
                        ref={fileInput} onChange={changeImage} />
                    <input type="file" name="replaceImage" className="hidden" accept="images/*" 
                        ref={replaceInput} onChange={selectReplaceImage} />
                </div>
            </div>
        );
    }
}
