import { Action } from "@ngrx/store";
import { CoreTypes } from "./core.types";

export class CoreActions implements  Action {
    type = CoreTypes.LOADING

    constructor(public payload: {loading: boolean}){}
}