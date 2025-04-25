import { RootState } from "../rootReducer";

export const selectCurrentUser = (state: RootState) => state.user;
