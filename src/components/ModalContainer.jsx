import { modalConfig } from "../utils/modalConfigUtils"
import { ModalTemplate } from "../ModalTemplate"

export default function ModalContainer({ actionType, itemId, onClose }) {
    const config = modalConfig[actionType];
    if (!config) return null;
  
    const ModalComponent = config.component;
    const modalProps = typeof config.props === 'function'
      ? config.props(itemId)
      : config.props || {};
  
    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
            <ModalTemplate
                title={config.title}
                buttonText={config.buttonText}
                onSubmit={config.onSubmit}
            >
                <ModalComponent {...modalProps} onClose={onClose} />
            </ModalTemplate>
            </div>
      </div>
    );
  }