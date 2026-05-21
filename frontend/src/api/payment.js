import { plainApi } from "./axios"

export const confirmTossPayment = async (payload) => {
    const response = await plainApi.post("/payments/toss/confirm", payload);
    return response.data;
}