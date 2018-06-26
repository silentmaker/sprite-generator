import * as React from 'react';

import './SpriteGenerator.css';
import logo from '../../assets/images/logo.svg';
import * as actions from '../../actions/index';

export interface SpriteImage {
    name: string;
    size: number;
    source: string;
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
    onMoveImage(oldIndex: number, newIndex: number): actions.MoveImage;
    onClearImage(): actions.ClearImage
}

export class SpriteGenerator extends React.Component<StateProps & DispatchProps, object> {
    private fileInput: React.RefObject<HTMLInputElement>

    constructor(props: StateProps & DispatchProps) {
        super(props);
        this.fileInput = React.createRef();
        this.activeUpload = this.activeUpload.bind(this);
        this.changeStyle = this.changeStyle.bind(this);
        this.changePadding = this.changePadding.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.clearImage = this.clearImage.bind(this);
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
    public render() {
        const { style, padding, images } = this.props;
        const { activeUpload, changeStyle, changePadding, changeImage, clearImage, fileInput } = this;
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
                                </li>
                            )}
                        </ul>
                        
                        {images.length && <div className="image-clear" onClick={clearImage}>Clear All</div>}
                        <button className="button" onClick={activeUpload}>UPLOAD</button>
                    </div>

                    <input type="file" className="hidden" accept="images/*" multiple={true} 
                        ref={fileInput} onChange={changeImage} />
                </div>
            </div>
        );
    }
}
