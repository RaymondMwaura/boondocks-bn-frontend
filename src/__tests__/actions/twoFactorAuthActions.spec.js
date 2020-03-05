import moxios from "moxios";
import apiCall from "../../utils/api";
import { makeMockStore, mockSuccess } from "../../utils/makeMockStore";
import {
  DISABLE_TWO_FACTOR_AUTH,
  ERROR,
  GET_TWO_FACTOR_AUTH,
  LOADING, SEND_TWO_FACTOR_TEXT,
  SET_TWO_FACTOR_AUTH, VERIFY_TWO_FACTOR_AUTH
} from "../../store/actions/types";
import {
  disable2FA, errorResponse, get2FA, sendFATokenText, set2FA, verify2FA
} from "../../store/actions/twoFactorAuthActions";
import actionFunc from "../../utils/actionFunc";
import {
  successDisableTwoFactorAuth,
  successGetTwoFactorAuth, successSendTextTwoFactorAuth,
  successSetTwoFactorAuth, successVerifyTwoFactorAuth
} from "../../__mocks__/twoFactorAuthResponse";

const expectedResponse = (action, payload) => [
  actionFunc(LOADING, true),
  actionFunc(action, payload.data),
  actionFunc(LOADING, false)
];

describe("twoFactorAuthenticationAction", () => {
  beforeEach(() => moxios.install(apiCall));
  afterEach(() => moxios.uninstall(apiCall));

  it(`dispatches ${SET_TWO_FACTOR_AUTH}`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successSetTwoFactorAuth)
    ));
    return store.dispatch(set2FA({
      twoFAType: "sms_text_temp"
    })).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        SET_TWO_FACTOR_AUTH,
        successSetTwoFactorAuth
      ));
    });
  });

  it(`dispatches ${SET_TWO_FACTOR_AUTH} - Error:`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successSetTwoFactorAuth)
    ));
    return store.dispatch(set2FA({
      twoFAType: ""
    })).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        SET_TWO_FACTOR_AUTH,
        successSetTwoFactorAuth
      ));
    });
  });

  it(`dispatches ${GET_TWO_FACTOR_AUTH}`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successGetTwoFactorAuth)
    ));
    return store.dispatch(get2FA()).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        GET_TWO_FACTOR_AUTH,
        successGetTwoFactorAuth
      ));
    });
  });

  it(`dispatches ${VERIFY_TWO_FACTOR_AUTH}`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successVerifyTwoFactorAuth)
    ));
    return store.dispatch(verify2FA({
      token: "188780"
    })).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        VERIFY_TWO_FACTOR_AUTH,
        successVerifyTwoFactorAuth
      ));
    });
  });

  it(`dispatches ${SEND_TWO_FACTOR_TEXT}`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successSendTextTwoFactorAuth)
    ));
    return store.dispatch(sendFATokenText({
      phoneNumber: "+250788840482",
      secret: "FQUWCNLENFUGO4KLGU4WWV3DLVUHI222"
    })).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        SEND_TWO_FACTOR_TEXT,
        successSendTextTwoFactorAuth
        )
      );
    });
  });

  it(`dispatches ${DISABLE_TWO_FACTOR_AUTH}`, () => {
    const store = makeMockStore();
    moxios.wait(() => moxios.requests.mostRecent().respondWith(
      mockSuccess(successDisableTwoFactorAuth)
    ));
    return store.dispatch(disable2FA()).then(() => {
      const actual = store.getActions();
      expect(actual).toEqual(expectedResponse(
        DISABLE_TWO_FACTOR_AUTH,
        successDisableTwoFactorAuth
        )
      );
    });
  });
});
