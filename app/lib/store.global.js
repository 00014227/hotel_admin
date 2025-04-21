const { configureStore } = require("@reduxjs/toolkit")
const { rootReducer } = require("./root.reducer")

const store = configureStore({
    reducer: rootReducer
})

export default store;