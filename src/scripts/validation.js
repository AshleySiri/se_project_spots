export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  if (!errorElement) return;

  errorElement.textContent = errorMessage;
  inputElement.classList.add(config.inputErrorClass);
  errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  if (!errorElement) return;

  errorElement.textContent = "";
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((inputElement) => !inputElement.validity.valid);

export const disableButton = (buttonElement, config) => {
  if (!buttonElement) return;
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

const enableButton = (buttonElement, config) => {
  if (!buttonElement) return;
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (!buttonElement) return;

  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    enableButton(buttonElement, config);
  }
};

const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    config.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

export const resetValidation = (formElement, config) => {
  if (!formElement) return;

  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    config.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
};

export const enableValidation = (config) => {
  const formList = Array.from(
    document.querySelectorAll(config.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};
