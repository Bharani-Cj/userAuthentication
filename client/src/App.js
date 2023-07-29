import LogIn from './Routes/LoginRoute';
import Signup from './Routes/RegisterRoute';
import Home from './Routes/home';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={LogIn} />
          <Route path="/register" Component={Signup} />

          <Route path="/home" Component={Home} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
