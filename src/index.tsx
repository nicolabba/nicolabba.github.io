import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main/main";
import Sudoku from "./pages/sudoku/sudoku";


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/">
                  <Route index element={<Main />} />
                  <Route path="sudoku" element={<Sudoku />} />
                  {/*<Route path="contact" element={<Contact />} />*/}
                  {/*<Route path="*" element={<NoPage />} />*/}
              </Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();