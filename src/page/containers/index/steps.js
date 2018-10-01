import React, { Component } from 'react';

class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            tracks: [],
            title: '',
            desc: ''
        };
        this.inputRef = React.createRef();
    }

    handleUploadPhoto = () => {
        this.inputRef.current.click();
    }

    handlePhotoUploaded = () => {
        const photos = this.inputRef.current.files;
        this.setState({ images: Array.from(photos) });
    }

    renderStep() {
        const { images } = this.state;
        switch(this.props.step) {
        case 1:
        case 2:
        case 0:
        default:
            return (
                <React.Fragment>
                    <button className="upload" onClick={this.handleUploadPhoto}>
                        <span className="iconfont upload-btn" />上传照片
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg"
                            ref={this.inputRef}
                            onChange={this.handlePhotoUploaded}
                        />
                    </button>
                    {images.map(imageBlob => <img src={URL.createObjectURL(imageBlob)} />)}
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <div className="steps">
                {this.renderStep()}
            </div>
        );
    }
}

export default Steps;
