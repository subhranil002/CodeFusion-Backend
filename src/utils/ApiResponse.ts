class ApiResponse {
    success: boolean;
    message: string;
    data: {};

    constructor(message = "Server Response", data = {}) {
        this.success = true;
        this.message = message.toString();
        this.data = data;
    }
}

export default ApiResponse;
