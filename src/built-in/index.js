import EXIF from 'exif-js';
import { wgs2bd } from '@/util/geo';
import './index.css';

let map;

function loadMap() {
    const tag = document.createElement('script');
    tag.src = "https://api.map.baidu.com/api?v=2.0&ak=xKN1lGY9lNDXBDQ4WPdTmYsZ73hww0UU&callback=_init_story";
    const body = document.body || document.documentElement;
    body.appendChild(tag);
}

function initMap() {
    map = new BMap.Map("trace-story");
    map.addControl(new BMap.MapTypeControl({
        mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP
        ]
    }));     
    map.enableScrollWheelZoom(true);
}

function convertLocation(pos) {
    return pos[0] + pos[1] / 60 + pos[2] / 3600;
}

function renderImages(images) {
    // center and zoom
    const zoom = +document.querySelector('#trace-story').dataset.zoom || 12;
    const sum = images.reduce((acc, cur) => [acc[0] + +cur.longitude, acc[1] + +cur.latitude], [0, 0]);
    map.centerAndZoom(new BMap.Point(sum[0] / images.length, sum[1] / images.length), zoom);

    images.forEach((info) => {
        const correctPoint = wgs2bd({
            lat: +info.latitude,
            lon: +info.longitude
        });
        const point = new BMap.Point(correctPoint.lon, correctPoint.lat);
        const content = `<div class="trace-story-shortcut" title="海拔: ${info.altitude}m">
            <img src='${info.src}' />
            <div class="trace-story-desc">
                <div class="multiline-truncate">
                    <div class="track-desc">
                        <span>${info.desc}</span>
                    </div>
                </div>
                <span class="track-time">${info.time.replace(/:/g, '-').slice(0, 10)}</span>
            </div>
        </div>`;
        const label = new BMap.Label(content, {
            position: point,
            offset: new BMap.Size(-55, -110)
        });
        map.addOverlay(label);
    });
}

window._init_story = () => {
    const images = document.querySelectorAll('img[data-desc]');
    const imageData = [].slice.call(images).map(image => ({
        dom: image,
        src: image.src,
        desc: image.dataset.desc
    }));
    const processedImageData = [];

    initMap();

    imageData.forEach(data => {
        EXIF.getData(data.dom, function() {
            processedImageData.push({
                src: data.src,
                desc: data.desc,
                time: EXIF.getTag(this, 'DateTime'),
                altitude: +EXIF.getTag(this, 'GPSAltitude').valueOf().toFixed(1),
                latitude: convertLocation(EXIF.getTag(this, 'GPSLatitude')).toFixed(3),
                longitude: convertLocation(EXIF.getTag(this, 'GPSLongitude')).toFixed(3)
            });
            if (processedImageData.length === imageData.length) {
                renderImages(processedImageData);
            }
        });
    });
};

loadMap();
