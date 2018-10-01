import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import TraceStory from '@/page/app';
import '@/style/common.less';

const App = hot(module)(() => <TraceStory />);

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);
