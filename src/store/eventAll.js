import axios from "axios"

const SET_EVENTS = "SET_EVENTS"
const SET_EVENTS_LOADING = "SET_EVENTS_LOADING"
const CLEAR_EVENTS_LOADING = "CLEAR_EVENTS_LOADING"

const _setEvents = (events) => ({
  type: SET_EVENTS,
  events,
})

const _setEventsLoading = () => ({
  type: SET_EVENTS_LOADING,
})

const _clearEventsLoading = () => ({
  type: CLEAR_EVENTS_LOADING,
})

export const setEvents = () => {
  return async (dispatch) => {
    try {
      dispatch(_setEventsLoading())
      const { data } = await axios.get("/api/events")
      dispatch(_setEvents(data))
      dispatch(_clearEventsLoading())
    } catch (err) {
      console.log(err)
      dispatch(_clearEventsLoading())
    }
  }
}

const initialState = {
  data: [],
  isLoading: false,
}

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return { ...state, data: action.events }
    case SET_EVENTS_LOADING:
      return { ...state, isLoading: true }
    case CLEAR_EVENTS_LOADING:
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export default eventsReducer
