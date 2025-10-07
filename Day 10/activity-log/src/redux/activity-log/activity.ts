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
            state.forEach((each) => {
                if (each.email === action.payload.email) {
                    isFound = true;
                    each.log.unshift(logObject);
                }
                return each;
            });
            if (!isFound) {
                state.unshift({ email: action.payload.email, log: [logObject] });
            }
        }
    }
});

export default activitySlice.reducer;
export const { addActivity } = activitySlice.actions;