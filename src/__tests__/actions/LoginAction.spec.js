import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import {
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  BUTTON_LOADING,
  LOADING,
} from '../../store/actions/types';
import login from '../../store/actions/loginActions';
import apiCall from '../../utils/api';
import actionFunc from '../../utils/actionFunc';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Login Actions Test Suite', () => {
  beforeEach(() => {
    moxios.install(apiCall);
  });

  afterEach(() => {
    moxios.uninstall(apiCall);
  });

  it('it Should dispatch error when provided invalid email', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "error",
          "message": "invalid credentials"
        },
        status: 400
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: BUTTON_LOADING,
      },
      actionFunc(LOADING, true),
      {
        payload: "invalid credentials",
        type: LOGIN_FAILURE
      },
      actionFunc(LOADING, false),
      {
        payload: false,
        type: BUTTON_LOADING,
      },
      actionFunc(LOADING, false),
    ];
    store = mockStore({});
    const email = 'wrong_email@google.com';
    const password = '12345678';
    await store.dispatch(login({ email, password }))
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });

  it('it Should dispatch login successfully', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "success",
          "message": "success",
          "data": {
            "firstName": "Super",
            "lastName": "Administrator",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJlcXVlc3Rlcm9AdXNlci5jb20iLCJuYW1lIjoiUmVxdWVzdGVyIiwidXNlcklkIjoyLCJ2ZXJpZmllZCI6dHJ1ZSwicm9sZSI6InJlcXVlc3RlciIsImxpbmVNYW5hZ2VySWQiOjcsImlhdCI6MTU3ODQ4MjExMiwiZXhwIjoxNTc4NTY4NTEyfQ.JORuKad_7k-2qCTZmhpNyxgYx4xRFjUOdQ7L7ABdMW8"
          }
        },
        status: 200
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: BUTTON_LOADING,
      },
      actionFunc(LOADING, true),
      {
        payload: 'success',
        type: LOGIN_SUCCESS
      },
      actionFunc(LOADING, false),
      {
        payload: false,
        type: BUTTON_LOADING,
      },
      actionFunc(LOADING, false),
    ];
    store = mockStore({});
    const email = 'valid_user@google.com';
    const password = '12345678';
    await store.dispatch(login({ email, password }))
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });
});
