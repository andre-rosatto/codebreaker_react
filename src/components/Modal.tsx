import '../css/Modal.css';

interface ModalProps {
	title: string;
	children: JSX.Element
}

const Modal = ({ title, children }: ModalProps) => {
	return (
		<div className="Modal">
			<div className="window">
				<h2 className="title-bar">{title}</h2>
				<div>
					{children}
				</div>
			</div>
		</div>
	);
}

export default Modal;