import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { CLEAR_ERROR } from '../actions/actionTypes'

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const error = useSelector((state) => state.login.error)

  const showError = () => {
    messageApi.open({
      type: 'error',
      content: error,
    })
  }

  useEffect(() => {
    if (error !== null) {
      showError()
      dispatch({ type: CLEAR_ERROR })
    }
  }, [error])

  return (
    <div>
      {contextHolder}
      {children}
    </div>
  )
}

export default Layout
