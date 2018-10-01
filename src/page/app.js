import React, { Component } from 'react';
import AOS from 'aos';
import generate from './apis';
import Index from './containers/index';
import Preview from './containers/preview';
import 'aos/dist/aos.css';

AOS.init();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            tracks: [],
            meta: {},
            isPreview: false
        };
    }

    handleGenerate = ({ images, tracks, meta }) => {
        this.setState({
            images,
            tracks,
            meta,
            isPreview: true
        });
    }

    handleReEdit = () => {
        this.setState({ isPreview: false });
    }

    handleSubmit = (images, tracks, meta) => {
        const data = new FormData();
        images.forEach(image => {
            data.append('image[]', image);
        });
        tracks.forEach(track => {
            data.append('track[]', track);
        });
        data.append(meta);
        generate(data);
    }

    render() {
        const { images, tracks, meta, isPreview } = this.state;
        return !isPreview
            ? <Index onSubmit={this.handleGenerate} />
            : (
                <Preview
                    images={images}
                    tracks={tracks}
                    meta={meta}
                    onReEdit={this.handleReEdit}
                    onSubmit={this.handleSubmit}
                />
            );
    }
}

export default App;
