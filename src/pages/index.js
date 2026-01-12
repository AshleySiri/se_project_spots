import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../scripts/Api.js";
import { setButtonText } from "../utils/helpers.js";

/* ================= API ================= */

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "afb6ef2a-5008-4b6e-9e4e-e1d5af9c457e",
    "Content-Type": "application/json",
  },
});

/* ================= PROFILE ELEMENTS ================= */

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

/* ================= MODALS ================= */

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const previewModal = document.querySelector("#preview-modal");
const avatarModal = document.querySelector("#avatar-modal");
const deleteCardModal = document.querySelector("#delete-card-modal");

/* ================= BUTTONS ================= */

const editProfileBtn = document.querySelector(".profile__edit-btn");
const newPostBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

/* ================= CLOSE BUTTONS ================= */

const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const deleteCardCloseBtn = deleteCardModal.querySelector(".modal__close-btn");

/* ================= FORMS ================= */

const editProfileForm = editProfileModal.querySelector(".modal__form");
const addCardFormElement = newPostModal.querySelector(".modal__form");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const deleteCardForm = deleteCardModal.querySelector("#delete-card-form");

/* ================= INPUTS ================= */

const editProfileNameInput = editProfileModal.querySelector("#profile-name-input"); 
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const linkInput = newPostModal.querySelector("#card-image-input");
const nameInput = newPostModal.querySelector("#card-description-input");

const avatarInput = avatarModal.querySelector("#profile-avatar-input");

/* ================= SUBMIT BUTTONS ================= */

const editProfileSubmitBtn = editProfileForm.querySelector(".modal__submit-btn");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const deleteSubmitBtn = deleteCardForm.querySelector(".modal__submit-btn");

/* ================= PREVIEW ELEMENTS ================= */

const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

/* ================= CARDS ================= */

const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

/* ================= DELETE STATE ================= */

let selectedCard = null;
let selectedCardId = null;

/* ================= MODAL HELPERS ================= */

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleOverlayClose(evt) {
  if (evt.target === evt.currentTarget) closeModal(evt.currentTarget);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
  modal.addEventListener("click", handleOverlayClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
  modal.removeEventListener("click", handleOverlayClose);
}

/* ================= CARD CREATION ================= */

function getCardElement(data) {
  console.log("CARD LINK:", data.link);
  const cardElement = cardTemplate.cloneNode(true);

  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  const cardDelBtn = cardElement.querySelector(".card__delete-button");

  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    const isLikedNow = cardLikeBtnEl.classList.contains("card__like-button_active");
    const request = isLikedNow ? api.removeLike(data._id) : api.addLike(data._id);

    request
      .then((updatedCard) => {
        if (updatedCard.isLiked) {
          cardLikeBtnEl.classList.add("card__like-button_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-button_active");
        }
        data.isLiked = updatedCard.isLiked;
      })
      .catch((err) => console.error("Like error:", err));
  });

  cardDelBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteCardModal);
  });

  cardImageEl.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

/* ================= INITIAL DATA LOAD ================= */

api
  .getAppInfo()
  .then(([userData, cards]) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
    profileAvatarEl.alt = userData.name;

    cardsList.innerHTML = "";
    cards.forEach((item) => {
      console.log("LOADED CARD LINK:", item);
      cardsList.append(getCardElement(item));
    });
  })
  .catch((err) => console.error("API error:", err));

/* ================= OPEN MODAL LISTENERS ================= */

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  resetValidation(addCardFormElement, validationConfig);
  openModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  resetValidation(avatarFormElement, validationConfig);
  openModal(avatarModal);
});

/* ================= CLOSE MODAL LISTENERS ================= */

editProfileCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));
avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));
deleteCardCloseBtn.addEventListener("click", () => closeModal(deleteCardModal));

document.querySelector("#delete-cancel-btn").addEventListener("click", () => {
  closeModal(deleteCardModal);
});

/* ================= SUBMIT HANDLERS ================= */

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  setButtonText(editProfileSubmitBtn, true, "Save", "Saving...");

  api
    .updateUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => console.error("API error:", err))
    .finally(() => {
      setButtonText(editProfileSubmitBtn, false, "Save", "Saving...");
    });
});


addCardFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  setButtonText(cardSubmitBtn, true, "Save", "Saving...");

  api
    .addCard({
      name: nameInput.value,
      link: linkInput.value,
    })
    .then((card) => {
      cardsList.prepend(getCardElement(card));
      addCardFormElement.reset();
      disableButton(cardSubmitBtn, validationConfig);
      closeModal(newPostModal);
    })
    .catch((err) => console.error("API error:", err))
    .finally(() => {
      setButtonText(cardSubmitBtn, false, "Save", "Saving...");
    });
});

avatarFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();

  setButtonText(avatarSubmitBtn, true, "Save", "Saving...");

  api
    .setUserAvatar({ avatar: avatarInput.value.trim() })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = profileNameEl.textContent;
      closeModal(avatarModal);
      avatarFormElement.reset();
      disableButton(avatarSubmitBtn, validationConfig);
    })
    .catch((err) => console.error("API error:", err))
    .finally(() => {
      setButtonText(avatarSubmitBtn, false, "Save", "Saving...");
    });
});

deleteCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch((err) => console.error("API error:", err))
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Delete", "Deleting...");
    });
});

/* ================= VALIDATION ================= */

enableValidation(validationConfig);
