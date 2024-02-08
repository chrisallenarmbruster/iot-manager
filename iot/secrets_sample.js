// Rename this file to secrets.js and replace the values with your own

export default {
  WIFI_NETWORK_NAME: "YOUR_WIFI_SSID_OR_NETWORK_NAME",
  WIFI_PASSWORD: "YOUR_WIFI_PASSWORD",
  LISTEN_PORT: 2500, // This is the port that the ESP32 will listen on - default is 2500
  REQUEST_TRANSPORT_LAYER: "UDP", // Or "TCP" - this is the transport layer that the ESP32 will use to send requests
  IOT_GATEWAY_ADDRESS: "192.168.1.100", // IP address that the ESP32 will send requests to (if using UDP can broadcast to entire subnet, i.e. 192.168.1.255)
  IOT_GATEWAY_PORT: 2500, // Port that the ESP32 will send requests to
};
