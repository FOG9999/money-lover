import { CoreActions } from "./core.actions";
import { CoreState, initCoreState } from "./core.state";
import { CoreTypes } from "./core.types";

export const CoreReducer = (
    state = initCoreState,
    action: CoreActions
): CoreState => {
    switch(action.type){
        case CoreTypes.LOADING: {
            return state = {
                ...state,
                loading: action.payload.loading
            }
        }
        default: {
            return state;
        }
    }
}