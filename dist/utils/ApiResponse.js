class ApiResponse {
    constructor(message = "Server Response", data = {}) {
        this.success = true;
        this.message = message.toString();
        this.data = data;
    }
}
export default ApiResponse;
