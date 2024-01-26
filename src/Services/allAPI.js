import { BASE_URL } from "./baseURL"
import { commonAPI } from "./commonAPI"

export const addProductAPI = async (reqBody, reqHeader) => {
    return commonAPI("POST", `${BASE_URL}/products/add`, reqBody, reqHeader)
}

export const viewProductAPI = async () => {
    return commonAPI("GET", `${BASE_URL}/products`, "", "")
}

export const deleteAProductAPI = async (id) => {
    console.log(id, "asdasdas");
    return commonAPI("DELETE", `${BASE_URL}/product/delete/${id}`, {}, "")
}

export const viewAProductAPI = async (id) => {
    return  commonAPI("GET",`${BASE_URL}/product/${id}`,"","")
}

export const editAProductAPI = async (id, reqBody,reqHeader) => {
    return commonAPI("PUT", `${BASE_URL}/product/edit/${id}`, reqBody, reqHeader)
}