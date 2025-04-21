import store from "@/app/lib/store.global";
import { Provider } from "react-redux";

export default function ReduxProvider({children}) {
    return <Provider store={store}>{children}</Provider>
}