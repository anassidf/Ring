import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './editor.css';

const toolbar_tools = [
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ font: [] }],
	[{ header: 1 }, { header: 2 }],
	['bold', 'italic', 'underline', 'strike'],
	['blockquote', 'code-block'],

	[{ list: 'ordered' }, { list: 'bullet' }],
	[{ script: 'sub' }, { script: 'super' }],
	[{ indent: '-1' }, { indent: '+1' }],
	[{ direction: 'rtl' }],

	[{ size: ['small', false, 'large', 'huge'] }],

	[{ color: [] }, { background: [] }],

	[{ align: [] }],

	['clean'],
];
const Editor = () => {
	// rename and distructor once at a time
	const { id: documentID } = useParams();
	const [socket, setSocket] = useState();
	const [quill, setQuill] = useState();

	let element = useRef();

	// create uniqe room for each client
	useEffect(() => {
		if (socket == null || quill == null) return;

		socket.once('documentID-back', (document) => {
			// bellow code = quill.setText('')
			quill.setContents(document);
			quill.enable();
		});

		socket.emit('send-documentID', documentID);
	}, [socket, quill, documentID]);

	// create quill
	useEffect(() => {
		let txt_editor = document.createElement('div');

		element.current.append(txt_editor);
		const quill_holder = new Quill(txt_editor, {
			theme: 'snow',
			modules: { toolbar: toolbar_tools },
		});

		quill_holder.disable();
		quill_holder.setText('loading...');
		setQuill(quill_holder);

		// cleanup

		return () => {
			element.current.innerHTML = '';
			console.log('CLEANINGUP');
		};
	}, []);

	// connect socket.io
	useEffect(() => {
		const socket_holder = io('http://localhost:4000');
		setSocket(socket_holder);

		return () => {
			socket_holder.disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket == null || quill == null) return;

		const handler = (delta, oldDelta, source) => {
			// skip if the change come from another resource (other than the user)
			if (source !== 'user') return;

			socket.emit('send-delta', delta);
		};

		// quill listener on every change occur
		quill.on('text-change', handler);

		return () => {
			quill.off('text-change', handler);
		};
	}, [socket, quill]);

	// apply the changes to the quills  editor
	useEffect(() => {
		if (socket == null || quill == null) return;

		const handler = (delta) => {
			quill.updateContents(delta);
		};
		socket.on('changes', handler);

		return () => {
			socket.off('changes', handler);
		};
	}, [socket, quill]);

	return <div ref={element} id='editor_container'></div>;
};

export default Editor;
