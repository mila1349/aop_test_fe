import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import JobList from './pages/JobList'
import DetailPage from './pages/DetailPage'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/jobdetail/:id" component={DetailPage} />
        <Route exact path="/" component={JobList} />
      </Switch>
    </Router>
  )
}

export default App
