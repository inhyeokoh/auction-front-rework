import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { Provider } from "react-redux";
import { createStore } from 'redux';

// 리듀서 정의 (임시로 빈 상태 반환)
const rootReducer = (state = {}, action) => {
    return state;
};

// 스토어 생성
const store = createStore(rootReducer);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
