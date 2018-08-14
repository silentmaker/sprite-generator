import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { Provider } from "react-redux";

import { reducer } from "./reducers/index";
import { StoreState } from './types/index';
import { GeneratorActions } from './actions/index';

import SpriteGenerator from './containers/SpriteGenerator';

const store = createStore<StoreState, GeneratorActions, {}, {}>(reducer, {
    imageSize: 0,
    alignStyle: 'horizontal',
    imagePadding: 0,
    originalImages: []
});

store.subscribe(() => {
    console.info('Current Store: ', store.getState());
});

import './assets/styles/reset.css';
import './assets/styles/helper.css';

ReactDOM.render(
    <Provider store={store}>
        <SpriteGenerator />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
