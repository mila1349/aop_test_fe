import { post } from 'axios'
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects'

export function handleAuthorize(user, password) {
  return new Promise(async (resolve, reject) => {
    const postData = {
      username: user,
      password: password,
    }
    try {
      const result = await post(
        'http://localhost:5000/api/auth/login',
        postData
      )
      console.log('hgtyuj', result)
      resolve(result.data.token)
    } catch (error) {
      reject(error)
    }
  })
}

export function handleSignup(user, password) {
  return new Promise(async (resolve, reject) => {
    const postData = {
      username: user,
      password: password,
    }
    try {
      const result = await post(
        'http://localhost:5000/api/auth/signUp',
        postData
      )
      resolve(result.data.token)
    } catch (error) {
      reject(error)
    }
  })
}

export function* authorize(user, password) {
  try {
    const token = yield call(handleAuthorize, user, password)
    yield put({ type: 'LOGIN_SUCCESS' })
    yield put({ type: 'SAVE_TOKEN', token })
  } catch (error) {
    const message = error.message
    yield put({ type: 'LOGIN_ERROR', error })
    yield put({ type: 'SET_ERROR', error: message })
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'LOGIN_CANCELLED' })
    }
  }
}

export function* signUp(user, password) {
  try {
    const token = yield call(handleSignup, user, password)
    yield put({ type: 'SIGNUP_SUCCESS' })
    yield put({ type: 'SAVE_TOKEN', token })
  } catch (error) {
    const message = error.message
    yield put({ type: 'SET_ERROR', error: message })
    yield put({ type: 'SIGNUP_ERROR', error })
  } finally {
    if (yield cancelled()) {
      yield put({ type: 'SIGNUP_CANCELLED' })
    }
  }
}

export function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    const task = yield fork(authorize, user, password)
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if (action.type === 'LOGOUT') {
      yield cancel(task)
      yield put({ type: 'DELETE_TOKEN' })
    }
  }
}

export function* signUpFlow() {
  while (true) {
    const { user, password } = yield take('SIGNUP_REQUEST')
    const task = yield fork(signUp, user, password)
    const action = yield take(['LOGOUT', 'SIGNUP_ERROR'])
    if (action.type === 'LOGOUT') {
      yield cancel(task)
      yield put({ type: 'DELETE_TOKEN' })
    }
  }
}

export function* logActions() {
  while (true) {
    const action = yield take('*')
    console.log(action.type)
  }
}
