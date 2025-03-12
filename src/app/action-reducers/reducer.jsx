import ACTIONUSER from "./action";

const ReducerUser= (state, action)=>{

    switch (action.type) {
        case ACTIONUSER.ADD_USER:
            return {
                ...state,
                usuarios:[...state.usuarios, action.payload]
            }
        default:
            state;
    }
}

export default ReducerUser;