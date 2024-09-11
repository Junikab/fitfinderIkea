import { Product } from "./popup";

declare global {
    interface Window {
        chrome: typeof chrome;
    }
}
