import { MouseEvent, ReactElement, useEffect, useState } from "react";

import {
  useAuth,
  useModal,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { templateReplace } from "utils";
import { addCustomPlaylistImage } from "utils/spotifyCalls";
import { editPlaylistDetails } from "utils/spotifyCalls/editPlaylistDetails";

interface IEditPlaylistDetailsProps {
  id?: string;
  name: string;
  description?: string;
  coverImg?: string;
  setNewPlaylistDetaisl?: (newDetails: {
    name: string;
    description?: string;
    coverImg: string;
  }) => void;
}

export default function EditPlaylistDetails({
  id,
  name: nameProp,
  description: descriptionProp,
  coverImg,
  setNewPlaylistDetaisl,
}: Readonly<IEditPlaylistDetailsProps>): ReactElement | null {
  const [name, setName] = useState(nameProp);
  const [description, setDescription] = useState(descriptionProp);
  const { user } = useAuth();
  const [imgUrl, setImgUrl] = useState(coverImg);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const { addToast } = useToast();
  const { setModalData } = useModal();
  const { setIgnoreShortcuts } = useSpotify();
  const [removePhoto, setRemovePhoto] = useState(false);
  const { translations } = useTranslations();

  async function handleSave(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    if (name !== nameProp || description !== descriptionProp) {
      const res = await editPlaylistDetails(id, name, description);
      if (res) {
        addToast({
          message: templateReplace(translations.toastMessages.typeUpdated, [
            translations.contentType.details,
          ]),
          variant: "success",
        });
      }
    }

    if (removePhoto) {
      addToast({
        message: templateReplace(translations.toastMessages.unabledToRemove, [
          translations.contentType.image,
        ]),
        variant: "error",
      });
    }

    if (imgFile && id) {
      const res2 = await addCustomPlaylistImage({
        user_id: user?.id,
        playlist_id: id,
        imageId: "edit-cover-image",
      });
      if (res2) {
        addToast({
          message: templateReplace(translations.toastMessages.typeUpdated, [
            translations.contentType.image,
          ]),
          variant: "success",
        });
      } else {
        addToast({
          message: templateReplace(translations.toastMessages.errorUpdating, [
            translations.contentType.image,
          ]),
          variant: "error",
        });
      }
    }

    if (setNewPlaylistDetaisl) {
      setNewPlaylistDetaisl({
        name,
        description,
        coverImg: imgUrl ?? "",
      });
    }

    setModalData(null);
  }

  const [openSettings, setOpenSettings] = useState(false);
  useEffect(() => {
    function handleClick() {
      setOpenSettings(false);
    }
    if (openSettings) {
      document.body.addEventListener("click", handleClick);
    } else {
      document.body.removeEventListener("click", handleClick);
    }

    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [openSettings]);

  if (!id) return null;
  return (
    <div className="container">
      <input
        accept="image/.jpg, image/.jpeg, image/.png"
        type="file"
        data-testid="image-file-picker"
        id="editDetails"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && !file.type.includes("image")) {
            addToast({
              message: translations.toastMessages.fileIsNotAnImage,
              variant: "error",
            });
            return;
          }

          if (file) {
            setImgFile(file);
            setImgUrl(URL.createObjectURL(file));
          }
        }}
      />
      <div className="image-container">
        <div draggable="false" className="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden="false"
            draggable="false"
            loading="eager"
            src={imgUrl ?? "/defaultSongCover.jpeg"}
            alt="Playlist cover"
            id="edit-cover-image"
            sizes="(min-width: 1280px) 232px, 192px"
          />
        </div>
        <div className="image-button-container">
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label aria-haspopup="true" htmlFor="editDetails">
              <div className="icon">
                <svg
                  role="img"
                  height="48"
                  width="48"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.318 1.975a3.329 3.329 0 1 1 4.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 0 1-1.28-1.28l1.581-4.376a4.726 4.726 0 0 1 1.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 0 0-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 0 0 1.001-.636L20.611 5.268a1.329 1.329 0 0 0 0-1.879z"></path>
                </svg>
                <span>Choose photo</span>
              </div>
            </label>
          </div>
        </div>
        <div className="three-dots-container">
          <button
            type="button"
            onClick={(e) => {
              setOpenSettings(!openSettings);
              e.stopPropagation();
            }}
            className="three-dots-button"
          >
            <svg
              role="img"
              height="16"
              width="16"
              aria-hidden="true"
              viewBox="0 0 16 16"
            >
              <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
            </svg>
            <span>Edit photo</span>
          </button>
          <section role="menu" tabIndex={0}>
            <div role="presentation">
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="option"
                onClick={(e) => {
                  e.stopPropagation();

                  const input = document.getElementById("editDetails");
                  if (input) {
                    input.click();
                  }
                  setOpenSettings(false);
                }}
              >
                Change photo
              </button>
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="option"
                onClick={(e) => {
                  e.stopPropagation();
                  setRemovePhoto(true);
                  setImgFile(null);

                  setOpenSettings(false);
                }}
              >
                Remove photo
              </button>
            </div>
          </section>
        </div>
      </div>
      <div className="title">
        <label htmlFor="name" className="title-name">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Add a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => {
            setIgnoreShortcuts.on();
          }}
          onBlur={() => {
            setIgnoreShortcuts.off();
          }}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.stopPropagation();
            }
          }}
          spellCheck="false"
          data-ms-editor="true"
          className="title-name-input"
          maxLength={100}
        />
        <span
          aria-label="Character counter"
          aria-live="off"
          aria-atomic="true"
          className={`title-name-counter ${name.length < 90 ? "hidden" : ""}`}
        >
          {name.length || 0}/100
        </span>
      </div>
      <div className="description">
        <label
          htmlFor="text-input-a71ee964a8aa7b67"
          className="description-label"
        >
          Description
        </label>
        <textarea
          data-testid="playlist-edit-details-description-input"
          placeholder="Add an optional description"
          spellCheck="false"
          data-ms-editor="true"
          className="description-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => {
            setIgnoreShortcuts.on();
          }}
          onBlur={() => {
            setIgnoreShortcuts.off();
          }}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.stopPropagation();
            }
          }}
          maxLength={300}
        />
        <span
          aria-label="Character counter"
          aria-live="off"
          aria-atomic="true"
          className={`description-counter ${
            (description?.length || 0) < 250 ? "hidden" : ""
          }`}
        >
          {description?.length ?? 0}/300
        </span>
      </div>
      <div className="save-button-container">
        <button
          data-testid="playlist-edit-details-save-button"
          className="save-button"
          type="button"
          onClick={handleSave}
          tabIndex={0}
        >
          <span>Save</span>
        </button>
      </div>
      <p className="disclaimer">
        By proceeding, you agree to give Spotify access to the image you choose
        to upload. Please make sure you have the right to upload the image.
      </p>
      <style jsx>{`
        section {
          background-color: #282828;
          border-radius: 4px;
          box-shadow:
            0 16px 24px rgba(0, 0, 0, 0.3),
            0 6px 8px rgba(0, 0, 0, 0.2);
          display: ${openSettings ? "block" : "none"};
          max-height: calc(100vh - 24px);
          max-width: 350px;
          min-width: 140px;
          overflow-y: auto;
          padding: 4px;
          position: absolute;
          left: 0;
          top: calc(100% + 4px);
          z-index: 9999999999999999999999999;
        }
        section .option {
          align-content: center;
          align-items: center;
          background-color: transparent;
          border-radius: 3px;
          border: none;
          color: #ffffffe6;
          cursor: default;
          display: flex;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          justify-content: space-between;
          line-height: 16px;
          min-width: 100%;
          padding: 8px 10px;
          text-align: start;
          text-decoration: none;
          width: max-content;
        }
        section .option.delimiter {
          border-top: 1px solid hsla(0, 0%, 100%, 0.1);
        }
        section .option:hover,
        section .option:focus {
          outline: none;
          background-color: #ffffff1a;
        }
        :global(.modal) {
          min-height: 384px;
          width: 524px;
        }
        .container {
          grid-gap: 16px;
          display: grid;
          grid-template: 32px 132px 32px auto/180px 1fr;
          grid-template-areas:
            "album-image title"
            "album-image description"
            ". save-button"
            "disclaimer disclaimer";
        }
        input {
          color: #b3b3b3;
          text-transform: none;
        }
        input[type="file"] {
          display: none;
        }
        .image-container {
          grid-area: album-image;
          height: 180px;
          margin: 0;
          position: relative;
          width: 180px;
        }
        .image {
          height: 100%;
          width: 100%;
        }
        img {
          box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
          user-select: none;
          object-fit: cover;
          object-position: center center;
          height: 100%;
          width: 100%;
        }
        .image-button-container {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
        .image-button-container > div {
          height: 100%;
          width: 100%;
        }
        .image-button-container label {
          background-color: rgba(0, 0, 0, 0.7);
          align-items: center;
          border: none;
          color: #fff;
          display: flex;
          justify-content: center;
          opacity: 0;
          padding: 0;
          text-align: center;
          height: 100%;
          width: 100%;
        }
        .image-button-container label:hover {
          opacity: 1;
        }
        .image-button-container .icon {
          margin-top: 16px;
          transition: opacity 0.2s;
        }
        .image-button-container .icon span {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          margin-block: 0px;
          font-size: 1rem;
          font-weight: 400;
          font-family: var(
            --font-family,
            CircularSp,
            CircularSp-Arab,
            CircularSp-Hebr,
            CircularSp-Cyrl,
            CircularSp-Grek,
            CircularSp-Deva,
            var(--fallback-fonts, sans-serif)
          );
          color: inherit;
          display: block;
        }
        svg {
          fill: currentcolor;
        }
        .three-dots-container {
          height: 32px;
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
        }
        .three-dots-container .three-dots-button {
          align-items: center;
          background-color: rgba(0, 0, 0, 0.3);
          border: none;
          border-radius: 500px;
          color: #b3b3b3;
          display: flex;
          justify-content: center;
          padding: 8px;
          text-decoration: none;
          opacity: 0;
        }
        .three-dots-container .three-dots-buttonbutton:focus {
          opacity: 1;
        }
        .image-container:hover .three-dots-container .three-dots-button {
          opacity: 1;
          pointer-events: auto;
          position: absolute;
        }
        .three-dots-container button:hover {
          color: #fff;
        }
        .three-dots-container span {
          clip: rect(0 0 0 0);
          border: 0;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }
        .title {
          grid-area: title;
          position: relative;
        }
        .title-name {
          left: 10px;
          box-sizing: border-box;
          margin-block: 0px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: inherit;
          color: #fff;
          inset-inline-start: 10px;
          opacity: 0;
          position: absolute;
          top: 0;
          transform: translateY(-50%);
          -webkit-transition: opacity 0.2s;
          transition: opacity 0.2s;
        }
        .description-label:before,
        .title-name:before {
          background: #282828;
          content: "";
          height: 2px;
          position: absolute;
          right: 50%;
          top: 50%;
          transform: translate(50%, -50%);
          width: 110%;
          z-index: -1;
        }
        .title:focus-within .title-name {
          opacity: 1;
        }
        .title-name-input {
          background: hsla(0, 0%, 100%, 0.1);
          border: 1px solid transparent;
          border-radius: 4px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          height: 40px;
          padding: 0 12px;
          width: 100%;
        }
        .title-name-input:focus {
          background-color: #333;
          border: 1px solid #535353;
          outline: none;
        }
        .title-name-counter {
          right: 8px;
          top: 0;
          transform: translateY(50%);
          background-color: #2e77d0;
          border-radius: 2px;
          padding: 0 4px;
          position: absolute;
          text-align: center;
          width: 7ch;
        }
        .description {
          grid-area: description;
          margin-top: 8px;
          position: relative;
        }
        .description:focus-within .description-label {
          opacity: 1;
        }
        .description-label {
          left: 10px;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          margin-block: 0px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #fff;
          inset-inline-start: 10px;
          opacity: 0;
          position: absolute;
          top: 0;
          transform: translateY(-50%);
          transition: opacity 0.2s;
        }
        .description-textarea {
          background: hsla(0, 0%, 100%, 0.1);
          border: 1px solid transparent;
          border-radius: 4px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          height: 100%;
          padding: 8px 8px 28px;
          resize: none;
          width: 100%;
        }
        .description-textarea:focus {
          background-color: #333;
          border: 1px solid #535353;
          outline: none;
        }
        .description-counter {
          bottom: 8px;
          right: 8px;
          width: 8ch;
          background-color: #2e77d0;
          border-radius: 2px;
          padding: 0 4px;
          position: absolute;
          text-align: center;
          width: 7ch;
        }
        .hidden {
          clip: rect(0 0 0 0);
          border: 0;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
        }
        .save-button-container {
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          grid-area: save-button;
          justify-self: flex-end;
        }
        .save-button {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(
            --font-family,
            CircularSp,
            CircularSp-Arab,
            CircularSp-Hebr,
            CircularSp-Cyrl,
            CircularSp-Grek,
            CircularSp-Deva,
            var(--fallback-fonts, sans-serif)
          );
          background-color: transparent;
          border: 0px;
          border-radius: 500px;
          cursor: pointer;
          display: inline-block;
          position: relative;
          text-align: center;
          text-decoration: none;
          text-transform: none;
          touch-action: manipulation;
          transition-duration: 33ms;
          transition-property: background-color, border-color, color, box-shadow,
            filter, transform;
          user-select: none;
          vertical-align: middle;
          transform: translate3d(0px, 0px, 0px);
          padding: 0px;
          min-inline-size: 0px;
          align-self: center;
        }
        .save-button:hover span {
          transform: scale(1.04);
          background-color: #f6f6f6;
        }
        .save-button:active span {
          background-color: #b7b7b7;
          box-shadow: none;
          transform: scale(1);
        }
        .save-button span {
          box-sizing: border-box;
          position: relative;
          background-color: var(--background-base, #ffffff);
          color: var(--text-base, #000000);
          display: flex;
          border-radius: 500px;
          font-size: inherit;
          min-block-size: 48px;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          padding-block: 8px;
          padding-inline: 32px;
        }
        .disclaimer {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          margin-block: 0px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: inherit;
          grid-area: disclaimer;
        }
      `}</style>
    </div>
  );
}
