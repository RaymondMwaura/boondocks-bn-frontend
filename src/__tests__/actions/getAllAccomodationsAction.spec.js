import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import localStorage from '../../__mocks__/LocalStorage';
import {
  FETCH_HOTEL_SUCCESS,
	FETCH_HOTEL_FAIL,
	FETCH_SINGLE_HOTEL_SUCCESS,
	FETCH_SINGLE_HOTEL_FAIL,
	LOADING,
  SET_STATS,
} from '../../store/actions/types';
import { getAllHotels, getHotel } from '../../store/actions/accomodations/getAccomodationActions';
import apiCall from '../../utils/api';
import actionFunc from '../../utils/actionFunc';

let store;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
global.localStorage = localStorage;

global.localStorage.setItem("bn_user_data", `{
	"email":"requestero@user.com",
	"name":"Requester",
	"userId":2,
	"verified":true,
	"role":"requester",
	"lineManagerId":7,
	"iat":1578472431,
	"exp":1578558831
}`);

describe('Create accomodations Actions Test Suite', () => {
  beforeEach(() => {
    moxios.install(apiCall);
  });

  afterEach(() => {
    moxios.uninstall(apiCall);
  });

  it('it Should dispatch error', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "error",
          "message": "unable to fetch"
        },
        status: 400
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: LOADING,
      },
      {
        payload: { message: "unable to fetch", status: 'error' },
        type: FETCH_HOTEL_FAIL
      },
      {
        payload: false,
        type: LOADING,
      },
    ];
    store = mockStore({});
    await store.dispatch(getAllHotels())
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });

  it('it Should dispatch success fetched', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "success",
          "message": "successfully fetched",
          data: []
        },
        status: 200
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: LOADING,
      },
      {
        payload: { message: "successfully fetched", status: 'success', data: [] },
        type: FETCH_HOTEL_SUCCESS
      },
      actionFunc(SET_STATS, {
        data: [
          {
            data: 'hotel',
            icon: 'fa fa-bed',
            label: 'All hotels',
            number: 0,
          }
        ],
        role: 'requester',
      }),
      {
        payload: false,
        type: LOADING,
      },
    ];
    store = mockStore({
      profileCardsState: {
        stats: {
          requester: [],
        }
      }
    });
    await store.dispatch(getAllHotels())
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });

  it('it Should dispatch error when provided wrong details', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "error",
          "message": "unable to fetch"
        },
        status: 400
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: LOADING,
      },
      {
        payload: { message: "unable to fetch", status: 'error' },
        type: FETCH_SINGLE_HOTEL_FAIL
      },
      {
        payload: false,
        type: LOADING,
      },
    ];
    store = mockStore({});
    await store.dispatch(getHotel(1))
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });

  it('it Should dispatch success created', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        response: {
          "status": "success",
          "message": "successfully fetched"
        },
        status: 200
      });
    });

    const expectedActions = [
      {
        payload: true,
        type: LOADING,
      },
      {
        payload: { message: "successfully fetched", status: 'success' },
        type: FETCH_SINGLE_HOTEL_SUCCESS
      },
      {
        payload: false,
        type: LOADING,
      },
    ];
    store = mockStore({});
    await store.dispatch(getHotel())
    .then(async () => {
      const calledActions = store.getActions();
      expect(calledActions).toEqual(expectedActions);
    });
  });
});
