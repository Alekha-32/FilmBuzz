import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./components/App";
import { Provider } from "react-redux";
import Store from "./app/store";
import ToggleColorModeProvider from "./utils/ToggleColorMode";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={Store}>
        <ToggleColorModeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ToggleColorModeProvider>
    </Provider>,
);