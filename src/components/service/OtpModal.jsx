import React, { useState } from 'react';
import { ModalTheme } from "../../utils/themes";
import { Modal } from "flowbite-react";
import OtpInput from 'react-otp-input';
import { Button, Blockquote } from "flowbite-react";

function OtpModal({ showModal, otp, verify, setShowModal }) {

  const [inputOtp, setInputOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const submitOtp = () => {
    if (inputOtp && inputOtp?.length != 4) {
      return setErrorMessage("The OTP entered is incorrect*");
    }
    if (inputOtp == otp) {
      verify(true);
      setShowModal(false);
    } else {
      return setErrorMessage("The OTP entered is incorrect");
    }
  }

  return (
    <Modal
      theme={ModalTheme}
      show={showModal}
      onClose={() => {
        verify(false);
        setShowModal(false);
      }}
    >
      <Modal.Header>OTP Verification</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center gap-4 mt-3 w-[100%]">
          <OtpInput
            value={inputOtp}
            onChange={setInputOtp}
            numInputs={4}
            renderSeparator={<span className="mx-2">-</span>}
            renderInput={(props) => <input {...props} className="w-[30px] h-[30px] text-center text-xl text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500 p-1" />}
            className="w-[450px]"
          />
          <Button onClick={submitOtp}>Submit</Button>
          {errorMessage && <Blockquote className='text-[0.7rem] text-red-500'>{errorMessage}</Blockquote>}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default OtpModal;
