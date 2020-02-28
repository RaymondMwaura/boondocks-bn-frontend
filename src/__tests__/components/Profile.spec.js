import React from "react";

import {
	cleanup,
	fireEvent,
	render as reactRender,
	waitForElement
} from "@testing-library/react";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { applyMiddleware, createStore } from 'redux';
import reducers from '../../store/reducers';
import { Provider } from 'react-redux';
import ViewProfileComponent from '../../components/ViewProfileContainer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
	getUserProfile, getUsers,
} from '../../lib/services/user.service';
import localStorage from '../../__mocks__/LocalStorage';
import { createMemoryHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import EditProfileComponent from '../../components/EditProfileContainer';
import Cookies from "universal-cookie";
import token from '../../__mocks__/token';
import { getAllRequests } from "../../lib/services/requests.service";
import { getUserBooking } from "../../lib/services/booking.service";
import { getAllHotels } from "../../store/actions/accomodations/getAccomodationActions";
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

jest.mock("../../lib/services/user.service");
jest.mock("../../lib/services/requests.service");
jest.mock("../../lib/services/booking.service");
jest.mock("../../store/actions/users/usersActions");
jest.mock("../../store/actions/accomodations/getAccomodationActions");

jest.mock("universal-cookie");
Cookies.mockImplementation(() => ({ get: () => token }));

const render = (ui, initialState = {}, options = {}) => {
	const store = createStore(reducers, initialState,
		composeWithDevTools(applyMiddleware(thunk)));
	const Providers = ({ children }) => (
		<Provider store={store}>{children}</Provider>
	);
	return reactRender(ui, { wrapper: Providers, ...options });
};

describe('User should be be able to view and edit profile', () => {
  let ViewComponent;
  let EditComponent;

	const userProfile = {
		data: {
			data: {
				firstName: "Requester",
				lastName: "User",
				email: "requester@user.com",
				isVerified: true,
				birthDate: "2001-11-11T00:00:00.000Z",
				residenceAddress: '',
				preferredLanguage: "French USA",
				preferredCurrency: "usd",
				department: "marketing",
				gender: "male",
				lastLogin: "2020-01-04T08:19:43.909Z",
				role: "requester",
				phoneNumber: "0786466253",
				lineManager: {
					id: 7,
					firstName: "john",
					lastName: "doe",
				},
			}
		}
	};

	const userWithoutManager = {
		data: {
			data: {
				firstName: "Requester",
				lastName: "User",
				email: "requester@user.com",
				isVerified: true,
				birthDate: "2001-11-11T00:00:00.000Z",
				residenceAddress: '',
				preferredLanguage: '',
				preferredCurrency: '',
				department: "marketing",
				gender: '',
				lastLogin: "2020-01-04T08:19:43.909Z",
				role: "requester",
				phoneNumber: "0786466253",
				lineManager: 'none',
			}
		}
	};

	const managers = {
		data: {
			data: [
				{
					id: 2,
					firstName: "john",
					lastName: "doe",
					email: "john@barefoot.com",
					birthDate: '2001-11-11T00:00:00.000Z',
					residenceAddress: '',
					lineManagerId: '',
					preferredLanguage: '',
					preferredCurrency: '',
					department: '',
					gender: '',
					role: "manager",
					phoneNumber: '',
					createdAt: "2019-12-11T18:15:54.157Z",
					updatedAt: "2019-12-12T11:05:52.591Z"
				}
			]
		}
	};

	const initialState = {
		profileState: {
			userProfile: {},
			errors: {},
			managers: [],
			initialProfile: {},
			isFetching: false,
			fetchError: null,
			isEditing: true,
			currentUserId: null
		}
  };
  
  getAllRequests.mockImplementation(() => Promise.resolve({
    data: {
      data: []
    }
  }));
  getUserBooking.mockImplementation(() => Promise.resolve({
    data: {
      data: []
    }
  }));
  getUsers.mockImplementation(() => Promise.resolve({
    data: {
      data: []
    }
  }));
  getAllHotels.mockImplementation(() => Promise.resolve({
    data: {data: []}
  }))
	getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
	getUsers.mockImplementation(() => Promise.resolve(managers));
	beforeEach(() => {
		global.localStorage.setItem("bn_user_data", `{
		"email":"requestero@user.com",
		"name":"Requester",
		"userId":1,
		"verified":true,
		"role":"requester",
		"lineManagerId":7,
		"iat":1578472431,
		"exp":1578558831
	}`);

		const history = createMemoryHistory();
		ViewComponent = (
			<BrowserRouter><ViewProfileComponent history={history} match={{ params: { userId: 1 }}}/></BrowserRouter>
    );

    EditComponent = (
			<BrowserRouter><EditProfileComponent history={history} match={{ params: { userId: 1 }}}/></BrowserRouter>
    );

	});

	afterEach(() => {
		cleanup();
		global.localStorage.clear();
		localStorage.store = {};
	});

	afterEach(cleanup);
	test('User can view profile information', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
		const { getByText, getByTestId } = render(ViewComponent, initialState);
		const profileTitle = await waitForElement(
			() => getByText("Profile Information")
		);
		expect(getByText("Contact Information")).toBeInTheDocument();
		expect(getByText("marketing")).toBeInTheDocument();

		const editBtn = getByTestId('btn-edit');
		fireEvent.click(editBtn);
	});

	test('User can view profile without a line manager information', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userWithoutManager));
		const { getByText, getByTestId } = render(ViewComponent, initialState);
		const profileTitle = await waitForElement(
			() => getByText("Profile Information")
		);
		expect(getByText("Contact Information")).toBeInTheDocument();
		expect(getByText("marketing")).toBeInTheDocument();

		const editBtn = getByTestId('btn-edit');
		fireEvent.click(editBtn);
	});

	test('User can edit profile information', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    const { getByText, getByDisplayValue, getByPlaceholderText } = render(EditComponent, initialState);

    await waitForElement(
			() => getByDisplayValue('requester@user.com')
		);
    expect(getByDisplayValue('requester@user.com')).toBeInTheDocument();
		const [emailField, departmentField, firstNameField] = await waitForElement(
			() => [
				getByPlaceholderText('Enter Email'),
        getByPlaceholderText('Enter Department'),
        getByPlaceholderText('Enter First Name'),
			]
    );

    fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);

    fireEvent.change(firstNameField, { target: { value: 'user'}});
    fireEvent.blur(firstNameField);

		fireEvent.change(emailField, { target: { value: 'user@'}});
		fireEvent.blur(emailField);
		expect(getByText('Email is not valid')).toBeInTheDocument();
		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);
		fireEvent.change(emailField, { target: { value: 'user@gmail.com'}});
		fireEvent.blur(emailField);
	});

	test('User can revert profile changes', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
		const { getByDisplayValue, getByText, getByPlaceholderText } = render(EditComponent, initialState);
		await waitForElement(
			() => getByDisplayValue('requester@user.com')
    );

		const [emailField, cancelButton] = await waitForElement(
			() => [
				getByPlaceholderText('Enter Email'),
				getByText('Cancel')
			]
		);
		fireEvent.change(emailField, { target: { value: 'user@'}});
		fireEvent.blur(emailField);
		fireEvent.click(cancelButton);
	});

	test('User can save profile changes', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userWithoutManager));
		const { getByText, getByDisplayValue, getByPlaceholderText, getByLabelText } = render(EditComponent, initialState);
		await waitForElement(
			() => getByDisplayValue('requester@user.com')
    );
		const [phoneField, saveButton, dateField, managerField, firstNameField] = await waitForElement(
			() => [
				getByPlaceholderText('Enter Phone Number'),
        getByText('Save Changes'),
        getByLabelText('Date of Birth').closest('input'),
        getByPlaceholderText('Line Manager'),
				      getByPlaceholderText('Enter First Name'),
			]
    );

		fireEvent.change(firstNameField, { target: { value: '123'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(managerField, { target: { value: 0 }});
		fireEvent.blur(managerField);

		fireEvent.click(saveButton);

		fireEvent.change(firstNameField, { target: { value: 'hello'}});
		fireEvent.blur(firstNameField);

		fireEvent.change(dateField, { target: { value: '2020-12-12'}});
		fireEvent.blur(dateField);

		fireEvent.change(dateField, { target: { value: '2000-02-09'}});
		fireEvent.blur(dateField);

		fireEvent.change(managerField, { target: { value: 2 }});
		fireEvent.blur(managerField);


    fireEvent.change(phoneField, { target: { value: '0786666666'}});
		fireEvent.blur(phoneField);
		fireEvent.click(saveButton);
	});

	test('User can not save profile changes with errors', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
		const { getByText, getByPlaceholderText, getByDisplayValue } = render(EditComponent, initialState);
		await waitForElement(
			() => getByDisplayValue('requester@user.com')
    );

		const [emailField, currencyField, saveButton, lineManagerField, languageField, genderField] = await waitForElement(
			() => [
        getByPlaceholderText('Enter Email'),
        getByPlaceholderText('Preferred Currency'),
        getByText('Save Changes'),
        getByPlaceholderText('Line Manager'),
        getByPlaceholderText('Preferred Language'),
        getByPlaceholderText('Select Gender'),
			]
    );

    fireEvent.change(currencyField, { target: { value: 'Dollars'}});
    fireEvent.blur(currencyField);

    fireEvent.change(lineManagerField, { target: { value: '7'}});
    fireEvent.blur(lineManagerField);

		fireEvent.change(emailField, { target: { value: 'user@'}});
    fireEvent.blur(emailField);

    fireEvent.change(languageField, { target: { value: 'English'}});
    fireEvent.blur(languageField);

    fireEvent.change(genderField, { target: { value: 'male'}});
    fireEvent.blur(genderField);

    expect(getByText('Email is not valid')).toBeInTheDocument();
		expect(getByText('Save Changes')).toBeInTheDocument();
		fireEvent.click(saveButton);
    fireEvent.change(emailField, { target: { value: 'user@gmail.com'}});

		fireEvent.blur(emailField);
		fireEvent.click(saveButton);
  });
  
  // my tests start here
  test('User can edit profile information including profile picture upload', async () => {
		getUserProfile.mockImplementation(() => Promise.resolve(userProfile));
    const { getByTestId, getByText, getByDisplayValue, getByPlaceholderText } = render(EditComponent, initialState);

    await waitForElement(
			() => getByDisplayValue('requester@user.com')
		);
    expect(getByDisplayValue('requester@user.com')).toBeInTheDocument();
		const [emailField, departmentField, firstNameField, profilePictureField, saveButton] = await waitForElement(
			() => [
				getByPlaceholderText('Enter Email'),
        getByPlaceholderText('Enter Department'),
        getByPlaceholderText('Enter First Name'),
        getByTestId('profilePicture'),
        getByText('Save Changes'),
			]
    );

    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
      type: 'image/png',
    })

    Object.defineProperty(profilePictureField, 'files', {
      value: [file],
    })

    fireEvent.change(firstNameField, { target: { value: ''}});
    fireEvent.blur(firstNameField);

    fireEvent.change(firstNameField, { target: { value: 'user'}});
    fireEvent.blur(firstNameField);

		fireEvent.change(emailField, { target: { value: 'user@'}});
		fireEvent.blur(emailField);
		expect(getByText('Email is not valid')).toBeInTheDocument();
		fireEvent.change(departmentField, { target: { value: ''}});
		fireEvent.blur(departmentField);
		fireEvent.change(emailField, { target: { value: 'user@gmail.com'}});
    fireEvent.blur(emailField);
    fireEvent.change(profilePictureField);
    fireEvent.click(saveButton);
	});
});
