import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Typography, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { LOGIN_REQUEST } from '../actions/actionTypes'
import { useHistory } from 'react-router-dom'
import Layout from './Layout'

function Login() {
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useDispatch()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const token = useSelector((state) => state.login.token)
  const history = useHistory()

  useEffect(() => {
    if (token !== null) {
      history.push('/')
    }
  }, [token])

  const onFinish = () => {
    dispatch({ type: LOGIN_REQUEST, user: username, password: password })
  }

  return (
    <Layout>
      <div className="login-form">
        <Typography.Title>Login</Typography.Title>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="/signup">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  )
}

export default Login
