import React, { Component } from 'react';
import EXIF from 'exif-js';
import dayjs from 'dayjs';
import gpxParse from 'gpx-parse/dist/gpx-parse-browser';
import find from 'lodash/find';
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
            currImgDetail: {},
            showImgDetail: false
        };
        this.imgData = [];
    }

    componentDidMount() {
        this.initMap();
        this.convertTrack();
        this.convertPhotos();
    }

    handleMapClick = (e) => {
        const index = +e.target.dataset.index;
        if (index === index) {
            const currImgData = find(this.imgData, image => image.index === index);
            this.setState({
                currImgDetail: {
                    ...this.props.images[index],
                    ...currImgData
                },
                showImgDetail: true
            });
        } else {
            this.setState({ showImgDetail: false });
        }
    }

    handleSubmit = () => {
        this.props.onSubmit({ zoom: this.map.getZoom() });
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

    convertTrack() {
        const { tracks } = this.props;
        tracks.forEach(track => this.parseTrack(track));
    }

    async parseTrack(trackBlob) {
        const trackStr = await new Response(trackBlob).text();
        gpxParse.parseGpx(trackStr, (error, data) => {
            if (!data || !data.tracks) {
                alert('gpx文件格式有误。');
                return;
            }
            const track = data.tracks;
            const flattenTrack = track.reduce(
                (acc, cur) => cur.segments.reduce(
                    (acc, cur) => acc.concat(cur),
                    []
                ).concat(acc)
                , []);
            const points = flattenTrack.map(wgs2bd).map(({lat, lon}) => ({lat, lng: lon}));

            const polyline = new BMap.Polyline(
                points.map(p => new BMap.Point(p.lng, p.lat)),
                { enableMassClear: false }
            );
            polyline.setStrokeColor("#4a95ff");
            this.map.addOverlay(polyline);
        });
    }

    async convertPhotos() {
        const { images } = this.props;
        try {
            await Promise.all(images.map((image, index) => this.convertBlobToArrayBuffer(image.blob, index)));
        } catch (err) {
            console.warn(err);
        } finally {
            this.renderImages();
        }
    }

    async convertBlobToArrayBuffer(blob, index) {
        const buffer = await new Response(blob).arrayBuffer();
        const tags = EXIF.readFromBinaryFile(buffer);
        if (!tags.DateTime || !tags.GPSAltitude || !tags.GPSLatitude || !tags.GPSLongitude) {
            return;
        }
        this.imgData.push({
            blob,
            index,
            time: convertDateTime(tags.DateTime),
            altitude: +tags.GPSAltitude.valueOf().toFixed(1),
            latitude: convertLocation(tags.GPSLatitude).toFixed(3),
            longitude: convertLocation(tags.GPSLongitude).toFixed(3)
        });
    }

    renderImages() {
        const sum = this.imgData.reduce((acc, cur) => [acc[0] + +cur.longitude, acc[1] + +cur.latitude], [0, 0]);
        this.map.centerAndZoom(new BMap.Point(sum[0] / this.imgData.length, sum[1] / this.imgData.length), 12);

        this.imgData.forEach(image => {
            const correctPoint = wgs2bd({
                lat: +image.latitude,
                lon: +image.longitude
            });
            const point = new BMap.Point(correctPoint.lon, correctPoint.lat);
            const labelContent = `<div class="trace-story-shortcut" data-index=${image.index}>
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
        const { showImgDetail, currImgDetail } = this.state;
        return (
            <React.Fragment>
                <div className="preview" id="trace-story" onClick={this.handleMapClick} />
                <aside className="preview-sider">
                    {showImgDetail
                        ? (
                            <React.Fragment>
                                <img src={URL.createObjectURL(currImgDetail.blob)} className="photo" />
                                <div className="photo-meta">
                                    <span>
                                        <span className="iconfont calendar" />
                                        {dayjs(currImgDetail.time).format('YYYY-MM-DD')}
                                    </span>
                                    <span className="middle">
                                        <span className="iconfont earth" />
                                        {currImgDetail.latitude} E° {currImgDetail.longitude} N°
                                    </span>
                                    <span>
                                        <span className="iconfont altitude" />
                                        {currImgDetail.altitude} m
                                    </span>
                                </div>
                                <div className="photo-desc">{currImgDetail.desc}</div>
                            </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                <div className="title">{title}</div>
                                <div className="meta">
                                    <span className="author">{author}</span>
                                    <span className="date">{dayjs().format('YYYY-MM-DD')}</span>
                                </div>
                                <div className="desc">{desc}</div>
                            </React.Fragment>
                        )}
                    <aside className="preview-btns">
                        <button className="reedit" onClick={this.props.onReEdit}>返回编辑</button>
                        <button className="generate" onClick={this.handleSubmit}>生成文件</button>
                    </aside>
                </aside>
            </React.Fragment>
        );
    }
}

export default Preview;
