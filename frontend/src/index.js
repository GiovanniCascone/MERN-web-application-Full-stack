import React from 'react';
import ReactDOM from 'react-dom/client';
//Bootstrap
//import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import App from './App';
//Provider
import { AuthContextProvider } from './context/authContext'
import { AuthAdminContextProvider } from './context/authAdminContext'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <AuthContextProvider>
      <AuthAdminContextProvider>
        <div className='bg-light'>
          <App />
        </div>
      </AuthAdminContextProvider>
    </AuthContextProvider>
  //</React.StrictMode>
);

