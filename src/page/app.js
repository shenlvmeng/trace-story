import React, { Component } from 'react';
import generate from './apis';
import Index from './containers/index';
import Preview from './containers/preview';

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

    handleSubmit = ({ zoom }) => {
        const { title, desc } = this.state.meta;
        const data = new FormData();
        this.state.images.forEach(image => {
            data.append('image[]', image.blob);
        });
        this.state.tracks.forEach(track => {
            data.append('track[]', track);
        });
        data.append('imageDesc', this.state.images.map(img => img.desc));
        data.append('zoom', zoom);
        data.append('title', title);
        data.append('desc', desc);

        generate(data);
    }

    render() {
        const { images, tracks, meta, isPreview } = this.state;
        return !isPreview
            ? <Index
                images={images}
                tracks={tracks}
                meta={meta}
                onSubmit={this.handleGenerate}
            />
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
