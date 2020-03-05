import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import socketClient from 'socket.io-client';
import Toast from '../lib/toast';
import { getToken } from './authHelper';

import { getNewNotification } from '../store/actions/notificationAction';

const useChat = () => {
	const [messages, setMessages] = useState([]);
	const socketRef = useRef();
	const dispatch = useDispatch();
	useEffect(() => {
		const token = getToken();

		const connectionOptions = {
			'force new connection': true,
			reconnectionAttempts: 'Infinity',
			timeout: 10000,
			query: { token },
		};

		socketRef.current = socketClient(process.env.API_URL, connectionOptions);
		// eslint-disable-next-line no-shadow
		socketRef.current.on('getting', ({ messages }) => {
			const formatMessages = messages.map(message => ({
				id: message.id,
				userId: message.userId,
				message: message.message,
				timestamp: message.createdAt,
				username: `${message.user.firstName}`,
			}));
			setMessages([...formatMessages]);
		});
		socketRef.current.on('new_message', message => {
			setMessages(prevMessages => [...prevMessages, message]);
		});

		socketRef.current.on('authentication_error', error => {
			Toast('error', error);
		});

		socketRef.current.on('new_comment', data => {
			dispatch(getNewNotification(data));

			Toast('info', data.messages);
		});

		socketRef.current.on('new_request', data => {
			dispatch(getNewNotification(data));
			Toast('info', data.messages);
		});

		socketRef.current.on('request_approved_or_rejected', data => {
			dispatch(getNewNotification(data));
			Toast('info', data.messages);
		});

		socketRef.current.on('edited_request', data => {
			dispatch(getNewNotification(data));
			Toast('info', data.messages);
		});

		return () => {
			socketRef.current.disconnect();
		};
	}, []);

	const sendMessage = data => {
		socketRef.current.emit('new_message', data);
	};

	const getPriorMessages = () => {
		socketRef.current.emit('get_messages');
	};

	return { messages, sendMessage, getPriorMessages };
};

export default useChat;
