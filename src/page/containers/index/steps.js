import React, { Component } from 'react';
import classNames from 'classnames';
import EXIF from 'exif-js';

class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images.length ? props.images : [],
            tracks: props.tracks.length ? props.tracks : [],
            author: props.meta.author || '',
            title: props.meta.title || '',
            desc: props.meta.desc || ''
        };
        this.photoInputRef = React.createRef();
        this.gpxInputRef = React.createRef();
    }

    handleUploadPhoto = () => {
        this.photoInputRef.current.click();
    }

    handleUploadGpx = () => {
        this.gpxInputRef.current.click();
    }

    handlePhotoUploaded = async () => {
        const photos = this.photoInputRef.current.files;
        const images = await Promise.all(Array.from(photos).map(async (photo) => {
            const buffer = await new Response(photo).arrayBuffer();
            const tags = EXIF.readFromBinaryFile(buffer);
            return {
                blob: photo,
                desc: '',
                hasGPSInfo: !!(tags.GPSLatitude && tags.DateTime)
            };
        }));
        this.setState({ images });
    }

    handlePhotoDescChange = (e) => {
        const key = e.target.dataset.key;
        const value = e.target.value;
        this.state.images[key].desc = value;
        this.forceUpdate();
    }

    handleRemovePhoto = (e) => {
        const key = e.currentTarget.dataset.key;
        this.setState((prevState) => {
            const newImages = [...prevState.images];
            newImages.splice(key, 1);
            return { images: newImages };
        });
    }

    handleGpxUploaded = () => {
        this.setState({
            tracks: Array.from(this.gpxInputRef.current.files)
        });
    }

    handleRemoveGpx = () => {
        this.setState({ tracks: [] });
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    handleAuthorChange = (e) => {
        this.setState({ author: e.target.value.trim() });
    }

    handleDescChange = (e) => {
        this.setState({ desc: e.target.value });
    }

    handleNext = () => {
        if (this.state.images.length) {
            this.props.onStepChange(1);
        }
    }

    handlePrev = () => {
        this.props.onStepChange(-1);
    }

    handleFinish = () => {
        const { title, desc, author, tracks, images } = this.state;
        if (!title || !desc || !author || !images.length) {
            return;
        }
        this.props.onSubmit({
            images,
            tracks,
            meta: { title, desc, author }
        });
    }

    renderStep(val) {
        const { images, tracks, desc, title, author } = this.state;
        switch (val) {
        case 1:
            return (
                <React.Fragment>
                    <div className="btns">
                        <button className="prev" onClick={this.handlePrev}>上一步</button>
                        <button className="upload" onClick={this.handleUploadGpx}>
                            <span className="iconfont upload-btn" />上传.gpx轨迹文件
                            <input
                                type="file"
                                accept=".gpx"
                                ref={this.gpxInputRef}
                                onChange={this.handleGpxUploaded}
                            />
                        </button>
                        <button className={classNames('next', {
                            disabled: !this.state.images.length
                        })} onClick={this.handleNext}>下一步</button>
                    </div>
                    {tracks.map((track, index) => (
                        <div className="track" key={index}>
                            <span className="title">{track.name}</span>
                            <span className="size">{(track.size / 1000).toFixed(1)} Kb</span>
                            <span className="close" onClick={this.handleRemoveGpx}>✕</span>
                        </div>
                    ))}
                </React.Fragment>
            );
        case 2:
            return (
                <React.Fragment>
                    <div className="btns">
                        <button className="prev" onClick={this.handlePrev}>上一步</button>
                        <button className={classNames('done', {
                            disabled: !title || !desc || !author || !images.length
                        })} onClick={this.handleFinish}>预览效果</button>
                    </div>
                    <input
                        type="text"
                        value={title}
                        placeholder="游记标题"
                        className="trace-title"
                        onChange={this.handleTitleChange}
                        maxLength="50"
                    />
                    <input
                        type="text"
                        value={author}
                        placeholder="作者"
                        className="trace-maker"
                        onChange={this.handleAuthorChange}
                        maxLength="20"
                    />
                    <textarea
                        value={desc}
                        className="trace-desc"
                        rows="10"
                        placeholder="写下简要的旅行感受..."
                        onChange={this.handleDescChange}
                    />
                </React.Fragment>
            );
        case 0:
        default:
            return (
                <React.Fragment>
                    <div className="btns">
                        <button className="upload" onClick={this.handleUploadPhoto}>
                            <span className="iconfont upload-btn" />上传照片
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg"
                                ref={this.photoInputRef}
                                onChange={this.handlePhotoUploaded}
                            />
                        </button>
                        <button className={classNames('next', {
                            disabled: !images.length
                        })} onClick={this.handleNext}>下一步</button>
                    </div>
                    {images.map((image, index) => (
                        <div className={classNames('photo', {
                            warn: !image.hasGPSInfo
                        })} key={index}>
                            <div className="photo-img">
                                <img src={URL.createObjectURL(image.blob)} />
                                <div className="remove" data-key={index} onClick={this.handleRemovePhoto}>
                                    <span className="iconfont trash" />删除
                                </div>
                            </div>
                            {image.hasGPSInfo
                                ? (
                                    <textarea
                                        rows="3"
                                        value={image.desc}
                                        placeholder="照片描述..."
                                        data-key={index}
                                        onChange={this.handlePhotoDescChange}
                                    />
                                )
                                : <div className="warn-message">未从照片中找到完整的定位信息，将影响生成效果</div>}
                        </div>
                    ))}
                </React.Fragment>
            );
        }
    }

    render() {
        const { step } = this.props;
        return (
            <div className="steps">
                <div className="steps-wrapper" style={{ marginLeft: `-${step * 100}%` }}>
                    {[0,1,2].map(val => (
                        <div className={classNames('step-content', {
                            inactive: val !== step
                        })} key={val}>
                            {this.renderStep(val)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Steps;
