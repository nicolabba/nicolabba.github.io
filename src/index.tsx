import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Routes, Route, HashRouter} from "react-router-dom";
// import Main from "./pages/main/main";
import Sudoku from "./pages/sudoku/sudoku";


ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
          <Routes>
              <Route path="/">
                  <Route index element={<Sudoku />} />
                  <Route path="sudoku" element={<Sudoku />} />
              </Route>
          </Routes>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();