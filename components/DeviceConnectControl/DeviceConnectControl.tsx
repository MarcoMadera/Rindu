import { ReactElement, useState } from "react";

import { Heading } from "components";
import { DeviceConnect, Playing } from "components/icons";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { templateReplace } from "utils";
import { getAvailableDevices, transferPlayback } from "utils/spotifyCalls";

export default function DeviceConnectControl(): ReactElement {
  const { isPremium } = useAuth();
  const { deviceId } = useSpotify();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);
  const currentActiveDevice = devices.find((device) => device.is_active);
  const thisDevice = devices.find((device) => device.id === deviceId);
  const currentDevice = currentActiveDevice ?? thisDevice;

  return (
    <div className="devices">
      {devices.length > 0 && (
        <div className="devices-container">
          <header>
            <div className="playing">
              {currentDevice?.is_active ? <Playing /> : null}
            </div>
            <div className="heading">
              <Heading number={3}>Current device</Heading>
            </div>
            <p
              className={`device-name device ${
                currentDevice?.is_active ? "active" : ""
              }`}
            >
              {currentDevice?.name}
            </p>
          </header>
          {devices.length > 1 && (
            <div className="another-device-header">
              <Heading number={4}>Select another device</Heading>
            </div>
          )}
          <ul>
            {devices.map((device) => {
              const isActive = device.is_active;
              const isThisDevice = device.id === deviceId;
              const isCurrentDevice = currentDevice?.id === device.id;

              if (isActive && isThisDevice) return null;
              if (isCurrentDevice) return null;
              return (
                <li key={device.id}>
                  <button
                    className={`device device-connect ${
                      isActive ? "active" : "inactive"
                    }`}
                    onClick={async () => {
                      if (isActive || !device.id) return;
                      const transferPlaybackResponse = await transferPlayback([
                        device.id,
                      ]);
                      if (transferPlaybackResponse) {
                        addToast({
                          message: templateReplace(
                            translations.toastMessages.deviceConnectedTo,
                            [device.name]
                          ),
                          variant: "success",
                        });
                      }
                    }}
                  >
                    <div className="device-info">
                      <div className="device-name device">
                        {isThisDevice ? `This ${device.type}` : device.name}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-label="open device selector"
        onClick={() => {
          if (!isPremium) {
            addToast({
              variant: "error",
              message: translations.toastMessages.premiumRequired,
            });
            return;
          }

          if (devices.length === 0) {
            getAvailableDevices().then((res) => {
              if (res?.devices) {
                setDevices(res.devices);
              }
            });
            return;
          }
          setDevices([]);
        }}
        className="button playerButton"
      >
        <DeviceConnect fill={devices.length > 0 ? "#1db954" : "#ffffffb3"} />
      </button>
      <style jsx>{`
        .devices {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999999999999999999999999;
          max-height: calc((var(--vh, 1vh) * 100) - 114px);
          overflow-y: auto;
          padding: 5px;
        }
        .another-device-header {
          margin-top: 10px;

          margin-bottom: 10px;

          padding: 0 10px;
        }
        .devices-container::before {
          border: 10px solid transparent;
          border-top-color: #282828;
          bottom: -20px;
          content: "";
          position: absolute;
          right: 141px;
        }
        .devices-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: 70px;
          display: block;
          border-radius: 5px;
          background-color: #282828;
          box-shadow: 0px 2px 9px 0px rgb(0 0 0 / 5%);
          padding: 17px 3px 3px 3px;
          width: 300px;
        }
        .devices-container header {
          display: grid;
          justify-content: center;
          grid-template-columns: 0.3fr 1fr;
          grid-template-areas: "playing heading" "playing device-name";
        }
        .devices-container header .playing {
          grid-area: playing;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .devices-container header .heading {
          grid-area: heading;
        }
        .devices-container header .device-name {
          grid-area: device-name;
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .device.active {
          color: #1db954;
        }
        button.device {
          background-color: transparent;
          width: max-content;
          min-width: 100%;
          border: none;
          display: flex;
          align-content: center;
          font-weight: 700;
          font-size: 14px;
          line-height: 16px;
          color: #fff;
          text-align: start;
          text-decoration: none;
          border-radius: 3px;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          height: 40px;
        }
        button.device:hover {
          outline: none;
          background-color: #ffffff1a;
        }
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          background-color: transparent;
          position: relative;
        }
        .button {
          width: 32px;
          height: 32px;
        }
        button:hover :global(svg path) {
          fill: #fff;
        }
        li {
          list-style: none;
        }
      `}</style>
    </div>
  );
}
