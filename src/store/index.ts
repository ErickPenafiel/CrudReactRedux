import { Middleware, configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userReducer, { rollbackUser } from "./users/slice";

const persistanceMiddleware: Middleware = (store) => (next) => (action) => {
	next(action);
	localStorage.setItem("__redux__state", JSON.stringify(store.getState()));
};

const syncWithDatabase: Middleware = (store) => (next) => (action) => {
	const { type, payload } = action;
	const previousState = store.getState();
	next(action);

	console.log(type, payload);

	if (type === "users/deleteUserById") {
		const userToRemove = previousState.users.find(
			(user) => user.id === payload,
		);
		fetch(`https://jsonplaceholder.typicode.com/users/${payload}`, {
			method: "DELETE",
		})
			.then((response) => {
				if (response.ok) {
					toast.success(`Usuario ${payload} eliminado correctamente`);
				}
			})
			.catch((err) => {
				toast.error(`Error al eliminar el usuario ${payload}`);
				if (userToRemove) store.dispatch(rollbackUser(userToRemove));
				console.log(err);
			});
	}
};

export const store = configureStore({
	reducer: {
		users: userReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(persistanceMiddleware, syncWithDatabase),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
