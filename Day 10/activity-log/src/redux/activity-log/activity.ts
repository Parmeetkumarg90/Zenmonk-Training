import { usersActivityInterface, activityActionInterface, activityInterface } from '@/interfaces/activity-log/activity';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: usersActivityInterface[] = [];

const activitySlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        addActivity: (state, action: PayloadAction<activityActionInterface>) => {
            const logObject: activityInterface = {
                time: action.payload.time,
                activity: action.payload.activity
            };
            let isFound = false;
            const newState = state.map((each) => {
                if (each.email === action.payload.email) {
                    isFound = true;
                    each.log.unshift(logObject);
                }
                return each;
            });
            if (!isFound) {
                newState.unshift({ email: action.payload.email, log: [logObject] });
            }
            return state = newState;
        }
    }
});

export default activitySlice.reducer;
export const { addActivity } = activitySlice.actions;