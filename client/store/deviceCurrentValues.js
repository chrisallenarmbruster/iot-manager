const UPDATE_DEVICE_CURRENT_VALUE = "UPDATE_DEVICE_CURRENT_VALUES"

export const updateDeviceCurrentValue = (deviceCurrentValue) => ({
  type: UPDATE_DEVICE_CURRENT_VALUE,
  deviceCurrentValue,
})

const initialState = {
  data: [],
}

const deviceCurrentValuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DEVICE_CURRENT_VALUE:
      let hasDeviceProperty = false
      let newData = state.data.map((device) => {
        if (
          device.deviceId === action.deviceCurrentValue.deviceId &&
          device.property === action.deviceCurrentValue.property
        ) {
          hasDeviceProperty = true
          return action.deviceCurrentValue
        } else {
          return device
        }
      })
      if (!hasDeviceProperty) {
        newData.push(action.deviceCurrentValue)
      }
      return { ...state, data: newData }
    default:
      return state
  }
}

export default deviceCurrentValuesReducer
