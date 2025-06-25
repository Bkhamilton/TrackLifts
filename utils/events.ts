type Handler = () => void;

class SimpleEventEmitter {
    private handlers: Record<string, Handler[]> = {};

    addEventListener(event: string, handler: Handler) {
        if (!this.handlers[event]) this.handlers[event] = [];
        this.handlers[event].push(handler);
    }

    removeEventListener(event: string, handler: Handler) {
        if (!this.handlers[event]) return;
        this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }

    dispatchEvent(event: string) {
        if (!this.handlers[event]) return;
        this.handlers[event].forEach(handler => handler());
    }
}

export const dataEvents = new SimpleEventEmitter();