/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

// Initial battery info: battery level: 0-100, charging status: true/false, supported by the browser: true/false 
const initialBatteryInfo = { level: 0, charging: false, supported: true };

export function BatteryIndicator() {
  const [batteryInfo, setBatteryInfo] = useState(initialBatteryInfo);

  // Update the battery info
  const updateBatteryInfo = (battery) => {
    setBatteryInfo({ level: battery.level * 100, charging: battery.charging, supported: true });
  };

  useEffect(() => {
    // Check if the browser supports the Battery Status API and setup the event listeners
    const checkBatteryAPIAndSetup = async () => {
      if ('getBattery' in navigator) {
        try {
          // Get the battery status
          const battery = await navigator.getBattery();
          updateBatteryInfo(battery);

          // Setup the event listeners for the battery status changes
          battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
          battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
        } catch (error) {
          console.error('Battery status is not supported.');
          setBatteryInfo((prev) => ({ ...prev, supported: false }));
        }
      } else {
        console.error('Battery status is not supported.');
        setBatteryInfo((prev) => ({ ...prev, supported: false }));
      }
    };

    checkBatteryAPIAndSetup();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      {batteryInfo.supported ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <BatteryInfo batteryInfo={batteryInfo} />
          <BatteryStatus charging={batteryInfo.charging} />
        </div>
      ) : (
        <UnsupportedBrowserMessage />
      )}
    </div>
  </div>
  );
}

const BatteryInfo = ({ batteryInfo }) => (
    <div className={`battery-indicator w-32 h-14 border-2 ${batteryInfo.charging ? 'border-green-500' : 'border-gray-500'} rounded-lg flex items-center justify-start overflow-hidden relative`}>
      <div
        className={`battery-level ${batteryInfo.level > 20 ? 'bg-green-300' : 'bg-red-500'} h-full`}
        style={{ width: `${batteryInfo.level}%` }}
      ></div>
      <div className="absolute w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500">
        {batteryInfo.level.toFixed(0)}%
      </div>
      {batteryInfo.charging && <ChargingIcon />}
    </div>
);

const ChargingIcon = () => (
    <svg className="absolute right-0 mr-[-6px] w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7L6 12h4v8l5-5h-4v-8z" />
  </svg>
);

const UnsupportedBrowserMessage = () => (
    <div className="p-4 rounded-md bg-gray-200 text-gray-700">
      Battery status is not supported in this browser.
    </div>
);

const BatteryStatus = ({ charging }) => (
  <div className="text-sm font-medium">
    {charging ? 'Charging' : 'Not Charging'}
  </div>
);


  
