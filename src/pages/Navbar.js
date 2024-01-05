import React, { useEffect } from 'react'
import { Layout, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { LOGOUT } from '../actions/actionTypes'

const { Header } = Layout

const NavBar = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.login.token)
  const history = useHistory()

  useEffect(() => {
    if (token === null) {
      history.push('/login')
    }
  }, [token])

  const handleLogout = () => {
    dispatch({ type: LOGOUT })
  }

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => handleLogout()}
          >
            Log out
          </Button>
        </div>
      </Header>
    </Layout>
  )
}

export default NavBar
