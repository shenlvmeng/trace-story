import React, { Component } from 'react';
import EXIF from 'exif-js';
import dayjs from 'dayjs';
import { wgs2bd } from '@/util/geo';
import './index.less';

function convertLocation(pos) {
    return pos[0] + pos[1] / 60 + pos[2] / 3600;
}

function convertDateTime(timeStr) {
    return timeStr.slice(0, 10).replace(/:/g, '-') + timeStr.slice(10);
}

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgData: [],
            showSideBar: true
        };
    }

    componentDidMount() {
        this.initMap();
        this.convertPhotos();
    }

    handleHideSideBar = () => {
        this.setState({ showSideBar: false });
    }

    initMap() {
        this.map = new BMap.Map('trace-story');
        this.map.addControl(new BMap.MapTypeControl({
            mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]
        }));
        this.map.enableScrollWheelZoom(true);
    }

    async convertPhotos() {
        const { images } = this.props;
        try {
            await Promise.all(images.map(image => this.convertBlobToArrayBuffer(image.blob)));
        } catch (err) {
            console.warn(err);
        } finally {
            this.renderImages();
        }
    }

    async convertBlobToArrayBuffer(blob) {
        const buffer = await new Response(blob).arrayBuffer();
        const tags = EXIF.readFromBinaryFile(buffer);
        if (!tags.DateTime || !tags.GPSAltitude || !tags.GPSLatitude || !tags.GPSLongitude) {
            return;
        }
        this.setState(prevState => ({
            imgData: [...prevState.imgData, {
                blob,
                time: convertDateTime(tags.DateTime),
                altitude: +tags.GPSAltitude.valueOf().toFixed(1),
                latitude: convertLocation(tags.GPSLatitude).toFixed(3),
                longitude: convertLocation(tags.GPSLongitude).toFixed(3)
            }]
        }));
    }

    renderImages() {
        const { imgData } = this.state;
        const sum = imgData.reduce((acc, cur) => [acc[0] + +cur.longitude, acc[1] + +cur.latitude], [0, 0]);
        this.map.centerAndZoom(new BMap.Point(sum[0] / imgData.length, sum[1] / imgData.length), 12);

        imgData.forEach(image => {
            const correctPoint = wgs2bd({
                lat: +image.latitude,
                lon: +image.longitude
            });
            const point = new BMap.Point(correctPoint.lon, correctPoint.lat);
            const labelContent = `<div class="trace-story-shortcut">
                <img src='${URL.createObjectURL(image.blob)}' />
            </div>`;
            const label = new BMap.Label(labelContent, {
                position: point,
                offset: new BMap.Size(-55, -110)
            });
            this.map.addOverlay(label);
        });
    }

    render() {
        const { title, desc, author } = this.props.meta;
        return (
            <React.Fragment>
                <div className="preview" id="trace-story" onClick={this.handleHideSideBar} />
                <aside className="preview-sider">
                    <div className="title">{title}</div>
                    <div className="meta">
                        <span className="author">{author}</span>
                        <span className="date">{dayjs().format('YYYY-MM-DD')}</span>
                    </div>
                    <div className="title">{desc}</div>
                </aside>
                <aside className="preview-btns">
                    <button className="reedit" onClick={this.props.onReEdit}>返回编辑</button>
                    <button className="generate" onClick={this.props.onSubmit}>生成文件</button>
                </aside>
            </React.Fragment>
        );
    }
}

export default Preview;
