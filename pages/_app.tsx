import { AppProps } from "next/app";
import React, { FC } from "react";
import { ThemeProvider, DefaultTheme } from "styled-components";
import GlobalStyle from "../components/globalstyles";
import "bootstrap/dist/css/bootstrap.css";
import { wrapper } from "../store/index";
import { Provider } from "react-redux";

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
  },
};

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...props.pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
