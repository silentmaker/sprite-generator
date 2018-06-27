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
    isStyled: boolean;
    isManaging: boolean;
    replacingIndex: number;
    spriteSource?: string;
    spriteStyle?: string;
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
        this.toggleManageImage = this.toggleManageImage.bind(this);
        this.moveImage = this.moveImage.bind(this);
        this.generateSprite = this.generateSprite.bind(this);
        this.toggleStyle = this.toggleStyle.bind(this);
        this.state = {
            isStyled: false,
            isManaging: false,
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
        this.setState({
            isStyled: false,
            isManaging: false,
            spriteSource: '',
            spriteStyle: ''
        });
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
    public toggleManageImage() {
        const status = !this.state.isManaging;

        this.setState({
            isManaging: status
        });
    }
    public moveImage(event: React.SyntheticEvent<EventTarget>) {
        const target = event.target as HTMLElement;
        const direction = target.dataset.direction;
        let index = parseInt(target.dataset.index || '', 10);
        
        this.props.onMoveImage(index, direction === 'up' ? --index : ++index);
    }
    public generateSprite() {
        this.setState({
            isStyled: false,
            spriteSource: ''
        });

        const imgOrigin = { x: 0, y: 0 };
        const canvas: any = document.getElementById('sprite-canvas');
        const lastIndex = this.props.images.length - 1;
        const lastImage: any = document.getElementById(`image-${lastIndex}`);
        let spriteStyle = '';

        canvas.width = lastImage.offsetLeft > 1024 ? (lastImage.offsetLeft + lastImage.clientWidth) : 1024;
        canvas.height = lastImage.offsetTop + lastImage.clientHeight;
        
        const context = canvas.getContext('2d');
        context.globalAlpha = 1.0;
        
        this.props.images.map((image, index) => {
            const imageElement = document.getElementById(`image-${index}`);
            if(imageElement) {
                if (index === 0) {
                    imgOrigin.x = imageElement.offsetLeft - this.props.padding;
                    imgOrigin.y = imageElement.offsetTop - this.props.padding;
                }

                context.drawImage(imageElement, 
                    imageElement.offsetLeft - imgOrigin.x, 
                    imageElement.offsetTop - imgOrigin.y);

                spriteStyle += `.bg-sprite-${index+1} {\n    width: ${imageElement.clientWidth}px;\n    height: ${imageElement.clientHeight}px;\n    background-position: -${imageElement.offsetLeft - imgOrigin.x}px -${imageElement.offsetTop - imgOrigin.y}px;\n}\n\n`;
            }
        });

        this.setState({
            spriteSource: canvas.toDataURL(),
            spriteStyle
        });
    }
    public toggleStyle() {
        const styled = !this.state.isStyled;

        this.setState({
            isStyled: styled
        });
    }
    public render() {
        const { style, padding, images } = this.props;
        const { isManaging, spriteSource, isStyled, spriteStyle } = this.state;
        const { activeUpload, fileInput, replaceInput, changeStyle, 
            changePadding, changeImage, clearImage, toggleManageImage, 
            removeImage, replaceImage, selectReplaceImage, moveImage, generateSprite, toggleStyle } = this;
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

                        {images.length > 0 && 
                            <button className="generate-button" onClick={generateSprite}>Generate</button>
                        }
                        {spriteSource && <a className="sprite-download" href={spriteSource} download="sprite.png">Download</a>}
                    </div>

                    <div className={`image-container${ images.length ? '' : ' image-container__empty'}`}>
                        <ul className={`image-list image-list__${ isManaging ? 'manage' : style }`}>
                            {images.map((image, index) => 
                                <li className="image-item" key={index}>
                                    {index < images.length - 1 ?
                                        <div className="image-lower" 
                                            data-index={index} data-direction="down"
                                            onClick={moveImage}>Down</div> : 
                                        <div className="image-lower" />
                                    }
                                    {index > 0 ?
                                        <div className="image-upper" 
                                            data-index={index} data-direction="up"
                                            onClick={moveImage}>Up</div> :
                                        <div className="image-upper" />
                                    }
                                    <div className="image-remove" data-index={index} onClick={removeImage}>Delete</div>
                                    <div className="image-replace" data-index={index} onClick={replaceImage}>Replace</div>
                                    <div className="image-name">{image.name}</div>
                                    <img id={`image-${index}`} className="image-cover" 
                                        style={{margin: `${padding}px`}}
                                        src={image.source} alt="IMAGE" />
                                </li>
                            )}
                        </ul>

                        {spriteSource && 
                            <div className="sprite-style">
                                <a href="javascript:void(0);" className="sprite-download"
                                    onClick={ toggleStyle }>{`${isStyled ? 'Hide' : 'Show'} CSS Rules`}</a>
                                {isStyled && <pre className="style-code">{ spriteStyle }</pre>}
                            </div>
                        }
                        
                        {images.length && <div className="image-manage" onClick={toggleManageImage}>
                            { isManaging ? 'Done' : 'Manage'}
                        </div>}
                        {isManaging&& <div className="image-clear" onClick={clearImage}>Clear All</div>}
                        <button className="upload-button" onClick={activeUpload}>UPLOAD</button>
                    </div>

                    <input type="file" name="addImage" className="hidden" accept="images/*" multiple={true} 
                        ref={fileInput} onChange={changeImage} />
                    <input type="file" name="replaceImage" className="hidden" accept="images/*" 
                        ref={replaceInput} onChange={selectReplaceImage} />
                    <canvas id="sprite-canvas" className="hidden" />
                </div>
            </div>
        );
    }
}
