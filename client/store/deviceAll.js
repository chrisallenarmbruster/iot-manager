import axios from "axios"

const SET_DEVICES = "SET_DEVICES"
const SET_DEVICES_LOADING = "SET_DEVICES_LOADING"
const CLEAR_DEVICES_LOADING = "CLEAR_DEVICES_LOADING"

const _setDevices = (devices) => ({
  type: SET_DEVICES,
  devices,
})

const _setDevicesLoading = () => ({
  type: SET_DEVICES_LOADING,
})

const _clearDevicesLoading = () => ({
  type: CLEAR_DEVICES_LOADING,
})

export const setDevices = () => {
  return async (dispatch) => {
    try {
      dispatch(_setDevicesLoading())
      const { data } = await axios.get("/api/devices")
      dispatch(_setDevices(data))
      dispatch(_clearDevicesLoading())
    } catch (err) {
      console.log(err)
      dispatch(_clearDevicesLoading())
    }
  }
}

const initialState = {
  data: [],
  isLoading: false,
}

const devicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICES:
      return { ...state, data: action.devices }
    case SET_DEVICES_LOADING:
      return { ...state, isLoading: true }
    case CLEAR_DEVICES_LOADING:
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default devicesReducer
