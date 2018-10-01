import React from 'react';
import classNames from 'classnames';
import previewImg from './preview.png';

function handleScroll() {
    window.scroll({
        top: Math.max(document.documentElement.clientHeight, 614) * 0.65 + 20,
        left: 0,
        behavior: 'smooth'
    });
}

export default function(props) {
    const { step } = props;
    return (
        <div className="header">
            <div className="banner-panel">
                <div className="title">Trace-story</div>
                <div className="divider"></div>
                <div className="slogan">使用图片定位和地理位置轨迹可视化你的游记</div>
                <button className="try-now" onClick={handleScroll}>尝试一下</button>
                <img src={previewImg} className="preview-img" />
            </div>
            <div className="step-intro">
                <div className="step">
                    <div className="step-content active">
                        <div className="iconfont photo" />
                        <div className="interpretation">
                            <p className="step-number">Step1: </p>
                            <p>上传你的游记照片</p>
                            <p>推荐3张以上</p>
                        </div>
                    </div>
                </div>
                <div className="step">
                    <div className={classNames('step-content', { active: step > 0 })}>
                        <div className="iconfont track" />
                        <div className="interpretation">
                            <p className="step-number">Step2: </p>
                            <p>上传你的gpx轨迹文件</p>
                            <p>秀出旅行轨迹</p>
                        </div>
                    </div>
                </div>
                <div className="step">
                    <div className={classNames('step-content', { active: step > 1 })}>
                        <div className="iconfont desc" />
                        <div className="interpretation">
                            <p className="step-number">Step3: </p>
                            补充旅行感受和其他信息
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
