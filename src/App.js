import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Entries } from './components/Entries';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Auth />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/settings' element={<Settings />}></Route>
      <Route path='/entries' element={<Entries />}></Route>
    </Routes>
  );
}

export default App;
