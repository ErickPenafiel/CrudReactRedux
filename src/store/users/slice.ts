import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserId = string;

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface UserWithId extends User {
	id: UserId;
}

const DEFAULT_STATE: UserWithId[] = [
	{
		id: "1",
		name: "Peter Doe",
		email: "prueba@gmail.com",
		github: "nombre",
	},
	{
		id: "2",
		name: "John Doe",
		email: "johndoe@gmail.com",
		github: "johndoe",
	},
	{
		id: "3",
		name: "Jane Doe",
		email: "janedoe@gmail.com",
		github: "janedoe",
	},
	{
		id: "4",
		name: "John Smith",
		email: "johnsmith@gmail.com",
		github: "johnsmith",
	},
	{
		id: "5",
		name: "Jane Smith",
		email: "janesmith@gmail.com",
		github: "janesmith",
	},
];

const initialState: UserWithId[] = (() => {
	const persistedState = localStorage.getItem("__redux__state");
	return persistedState ? JSON.parse(persistedState).users : DEFAULT_STATE;
})();

// let initialState: UserWithId[] = DEFAULT_STATE;
// const persistedState = localStorage.getItem("__redux__state");
// if (persistedState) {
// 	initialState = JSON.parse(persistedState).users;
// }

export const userSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		addNewUser: (state, action: PayloadAction<User>) => {
			const id = crypto.randomUUID();
			state.push({ id, ...action.payload })
		},
		deleteUserById: (state, action: PayloadAction<UserId>) => {
			const id = action.payload;
			return state.filter((user) => user.id !== id);
		},
		rollbackUser: (state, action: PayloadAction<UserWithId>) => {
			const isUserAlready = state.find((user) => user.id === action.payload.id);
			if (!isUserAlready) {
				state.push(action.payload)
			}
		},
	},
});

export default userSlice.reducer;

export const { addNewUser, deleteUserById, rollbackUser } = userSlice.actions;
