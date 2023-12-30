import axios from "axios"

const SET_SINGLE_DEVICE = "SET_SINGLE_DEVICE"
const CLEAR_SINGLE_DEVICE = "CLEAR_SINGLE_DEVICE"
const SET_SINGLE_DEVICE_LOADING = "SET_SINGLE_DEVICE_LOADING"
const CLEAR_SINGLE_DEVICE_LOADING = "CLEAR_SINGLE_DEVICE_LOADING"

const _setSingleDevice = (device) => {
  return {
    type: SET_SINGLE_DEVICE,
    device,
  }
}

export const _clearSingleDevice = () => {
  return {
    type: CLEAR_SINGLE_DEVICE,
  }
}

const _setSingleDeviceLoading = () => {
  return {
    type: SET_SINGLE_DEVICE_LOADING,
  }
}

const _clearSingleDeviceLoading = () => {
  return {
    type: CLEAR_SINGLE_DEVICE_LOADING,
  }
}

export const setSingleDevice = (id) => {
  return async (dispatch) => {
    try {
      dispatch(_setSingleDeviceLoading())
      const { data } = await axios.get(`/api/devices/${id}`)
      dispatch(_setSingleDevice(data))
      dispatch(_clearSingleDeviceLoading())
    } catch (err) {
      console.log(err)
      dispatch(_clearSingleDeviceLoading())
    }
  }
}

const initialState = {
  data: {},
  isLoading: false,
}

const deviceSingleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_DEVICE:
      return { ...state, data: action.device }
    case CLEAR_SINGLE_DEVICE:
      return initialState
    case SET_SINGLE_DEVICE_LOADING:
      return { ...state, isLoading: true }
    case CLEAR_SINGLE_DEVICE_LOADING:
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default deviceSingleReducer
