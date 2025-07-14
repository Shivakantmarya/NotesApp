import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Login from './Login'
import Note from './Note'
import { UserProvider } from './UserContext'

function App() {

  return (
    <UserProvider>
        <BrowserRouter>
       <Routes>
          <Route path='/' element = {<Signup/>}/>
          <Route path='/login' element = {<Login/>}/>
          <Route path='/note' element = {<Note/>}/>
       </Routes>
    </BrowserRouter>
    </UserProvider>
  )
}

export default App
