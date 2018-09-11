// 以下代码改编自 小菜 - 前端图片压缩并保留EXIF信息
// http://icaife.github.io/2015/05/19/js-compress-JPEG-width-exif/
const ImageTool = {
    /*
     * @param rawImageArray {ArrayBuffer|Array|Blob}
     * @desc get Image segments
     */
    getSegments(rawImage, callback) {
        if (rawImage instanceof Blob) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.getSegments(fileReader.result, callback);
            };
            fileReader.readAsArrayBuffer(rawImage);
        } else {
            if (!rawImage.length && !rawImage.byteLength) {
                callback([]);
                return;
            }
            let head = 0;
            let segments = [];
            let length, endPoint, seg;
            const arr = [].slice.call(new Uint8Array(rawImage), 0);

            while (1) { // eslint-disable-line no-constant-condition
                if (arr[head] === 0xff && arr[head + 1] === 0xda) { //Start of Scan 0xff 0xda  SOS
                    break;
                }

                if (arr[head] === 0xff && arr[head + 1] === 0xd8) { //Start of Image 0xff 0xd8  SOI
                    head += 2;
                } else { //找到每个marker
                    length = arr[head + 2] * 256 + arr[head + 3]; //每个marker 后 的两个字节为 该marker信息的长度
                    endPoint = head + length + 2;
                    seg = arr.slice(head, endPoint); //截取信息
                    head = endPoint;
                    segments.push(seg); //将每个marker + 信息 push 进去。
                }
                if (head > arr.length) {
                    break;
                }
            }
            callback(segments);
        }
    },
    /*
     * @param resizedImg {ArrayBuffer|Blob}
     * @param exifArr {Array|Uint8Array}
     * @desc insert EXIF into a image data
     */
    insertEXIF(resizedImg, exifArr, callback) {
        if (resizedImg instanceof Blob) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.insertEXIF(fileReader.result, exifArr, callback);
            };
            fileReader.readAsArrayBuffer(resizedImg);
        } else {
            const arr = [].slice.call(new Uint8Array(resizedImg), 0);
            if (arr[2] !== 0xff || arr[3] !== 0xe0) {
                // throw new Error("Couldn't find APP0 marker from resized image data.");
                callback(resizedImg); //不是标准的JPEG文件
                return;
            }

            const app0Length = arr[4] * 256 + arr[5]; //两个字节
            const newImage = [0xff, 0xd8].concat(exifArr, arr.slice(4 + app0Length)); //合并文件 SOI + EXIF + 去除APP0的图像信息

            callback(new Uint8Array(newImage));
        }
    },
    /*
     * @param segments {Array|Uint8Array}
     * @desc get EXIF array from segments
     */
    getEXIF(segments) {
        const length = segments.length;
        if (!length) {
            return [];
        }

        let seg = [];
        for (let x = 0; x < length; x++) {
            let s = segments[x];
            // TODO segments
            if (s[0] === 0xff && s[1] === 0xe1) { // app1 exif 0xff 0xe1
                seg = seg.concat(s);
            }
        }
        return seg;
    },
    /*
     * @param base64 {String}
     * @desc Decode base64 string to array buffer
     */
    decode64(base64) {
        const prefix = "data:image/jpeg;base64,";
        if (base64.slice(0, 23) !== prefix) {
            return [];
        }
        const binStr = window.atob(base64.replace(prefix, ""));
        const length = binStr.length;
        let buf = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            buf[i] = binStr.charCodeAt(i);
        }
        return buf;
    },
    /*
     * @param arr {Array}
     * @desc Encode array buffer to base64 string
     */
    encode64(arr) {
        let data = "";
        for (let i = 0, len = arr.length; i < len; i++) {
            data += String.fromCharCode(arr[i]);
        }
        return "data:image/jpeg;base64," + window.btoa(data);
    },
    /*
     * @param img {DOM}
     * @param imgBlob {Blob}
     * @param width {String}
     * @param height {String}
     * @param quality {Number} (0, 1]
     * @desc Read Image file as base64 string
     */
    minify(img, imgBlob, width, height, quality, callback) {
        const typeStr = "image/jpeg";
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
            this.getSegments(imgBlob, (segments) => {
                const exif = this.getEXIF(segments);
                this.insertEXIF(blob, exif, (newImage) => {
                    const url = URL.createObjectURL(new Blob([newImage], {type: "image/jpeg"}));
                    callback(url);
                });
            });
        }, typeStr, quality || 0.8);
    }
};

export default ImageTool;
