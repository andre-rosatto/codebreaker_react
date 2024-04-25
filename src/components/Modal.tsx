import '../css/Modal.css';

interface ModalProps {
	title: string;
	children?: JSX.Element
}

const Modal = ({ title, children }: ModalProps) => {
	return (
		<div className="Modal">
			<div className="Modal__window">
				<h2 className="Modal__title-bar">{title}</h2>
				<div>
					{children}
				</div>
			</div>
		</div>
	);
}

export default Modal;