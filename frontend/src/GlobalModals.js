import React, { useEffect, useState } from 'react';
import Event from './util/eventBus';
import OnSuccessModal from './components/OnSuccessModal';
import OnFailureModal from './components/OnFailureModal';
import OnNetworkFailureModal from './components/OnNetworkFailureModal';
import OnWarningModal from './components/OnWarningModal'; // optional

export default function GlobalModals() {
  const [modalState, setModalState] = useState({
    success: { show: false, title: '', message: '' },
    failure: { show: false, title: '', message: '' },
    warning: { show: false, title: '', message: '' },
    network: { show: false, title: '', message: '' },
  });

  useEffect(() => {
    const handleSuccess = ({ title, message }) => {
      setModalState((prev) => ({
        ...prev,
        success: { show: true, title, message },
      }));
    };

    const handleFailure = ({ title, message }) => {
      setModalState((prev) => ({
        ...prev,
        failure: { show: true, title, message },
      }));
    };

    const handleWarning = ({ title, message,positiveHandler, negativeHandler }) => {  
      
      setModalState((prev) => ({
        ...prev,
        warning: { show: true, title, message, positiveHandler, negativeHandler },
      }));
    };

    const handleNetwork = ({ title, message }) => {
      setModalState((prev) => ({
        ...prev,
        network: { show: true, title, message },
      }));
    };

    Event.on('OnSuccess', handleSuccess);
    Event.on('OnFailure', handleFailure);
    Event.on('OnWarning', handleWarning);
    Event.on('OnNetworkFailure', handleNetwork);

    return () => {
      Event.off('OnSuccess', handleSuccess);
      Event.off('OnFailure', handleFailure);
      Event.off('OnWarning', handleWarning);
      Event.off('OnNetworkFailure', handleNetwork);
    };
  }, []);

  return (
    <>
      <OnSuccessModal
        show={modalState.success.show}
        title={modalState.success.title}
        message={modalState.success.message}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            success: { ...prev.success, show: false },
          }))
        }
      />

      <OnFailureModal
        show={modalState.failure.show}
        title={modalState.failure.title}
        message={modalState.failure.message}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            failure: { ...prev.failure, show: false },
          }))
        }
      />

      <OnWarningModal
        show={modalState.warning.show}
        title={modalState.warning.title}
        message={modalState.warning.message} 
        positiveHandler={modalState.warning.positiveHandler} 
        negativeHandler={modalState.warning.negativeHandler}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            warning: { ...prev.warning, show: false },
          }))
        }
      />

      <OnNetworkFailureModal
        show={modalState.network.show}
        title={modalState.network.title}
        message={modalState.network.message}
        onClose={() =>
          setModalState((prev) => ({
            ...prev,
            network: { ...prev.network, show: false },
          }))
        }
      />
    </>
  );
}