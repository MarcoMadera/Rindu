import useAuth from "hooks/useAuth";
import useToast from "hooks/useToast";
import { ReactElement, useState } from "react";
import { getAvailableDevices } from "utils/spotifyCalls/getAvailableDevices";
import { transferPlayback } from "utils/spotifyCalls/transferPlayback";
import Heading from "./Heading";
import DeviceConnect from "./icons/DeviceConnect";

export default function DeviceConnectControl(): ReactElement {
  const { user, accessToken } = useAuth();
  const { addToast } = useToast();
  const [devices, setDevices] = useState<SpotifyApi.UserDevice[]>([]);
  const isPremium = user?.product === "premium";

  return (
    <div className="devices">
      {devices.length > 0 && (
        <div className="devices-container">
          <header>
            <Heading number={3}>Connect to a device</Heading>
            <div className="device-img-header-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://open.scdn.co/cdn/images/connect_header@1x.8f827808.png"
                alt="connect"
              />
            </div>
          </header>
          <ul>
            {devices.map((device) => (
              <li key={device.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (device.id) {
                      transferPlayback([device.id], {
                        accessToken,
                        play: true,
                      });
                    }
                  }}
                  className={`device ${device.is_active ? "active" : ""}`}
                >
                  {device.name}
                </button>
              </li>
            ))}
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
              message: "You need to be premium to use this feature",
            });
            return;
          }

          if (devices.length === 0) {
            getAvailableDevices(accessToken).then((res) => {
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
        <DeviceConnect fill={devices.length > 0 ? "#1db954" : "#b3b3b3"} />
      </button>
      <style jsx>{`
        .devices {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 932;
          max-height: calc(100vh - 114px);
          overflow-y: auto;
          padding: 5px;
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
        }
        .device-img-header-container {
          padding: 16px 0;
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .devices-container img {
          width: 180px;
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
