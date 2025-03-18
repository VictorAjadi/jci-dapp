import axios from "axios";
import { ErrorHandler } from "./errorHandler";

interface ResponseMessage {
    status: 'error' | 'fail' | 'success',
    message: string,
}
interface ResponseData extends Omit<ResponseMessage, 'message'>{
    data: Record<string,any> | Array<Record<string,any>>
}
interface ResponseFull extends ResponseMessage{
    data: Record<string,any> | Array<Record<string,any>>
}
//user routes
export const getUserByID = ErrorHandler(async (userID: string) : Promise<ResponseData> => {
    const token:string = await getCookie();
    const response = await axios.get(`/api/user/${userID}`,{headers:
       {
          'Authorization': `Bearer ${token}`
        }
       })
   return response.data
});
export const signUpUser = ErrorHandler(async (creds: Record<string,any>) : Promise<ResponseFull> => {
    const response = await axios.post(`/api/user/create`, creds,{headers: {
        'Content-Type': 'multipart/form-data',
      }});
    return response.data;
});
export const userLogin = ErrorHandler(async (creds: Record<string,any>) : Promise<ResponseFull> => {
    const response = await axios.post(`/api/user/login`,creds)
    return response.data;
});
export const updateUserDetails = ErrorHandler(async (creds: Record<string,any>): Promise<ResponseData> => {
    const token:string = await getCookie();
    const response = await axios.patch(`/api/user/profile-details`,creds,{headers:
        {
          'Authorization': `Bearer ${token}`
        }
       })
   return response.data
});
export const updateUserPassword = ErrorHandler(async (creds: Record<string,any>): Promise<ResponseMessage> => {
    const token:string = await getCookie();
    const response = await axios.patch(`/api/user/profile-password`,creds,{headers:
        {
          'Authorization': `Bearer ${token}`
        }
       })
   return response.data
});
export const userResetPassword = ErrorHandler(async (resetToken: string | undefined,creds: Record<string,any>): Promise<ResponseMessage>  => {
    const response = await axios.patch(`/api/user/password-reset/${resetToken}`,creds)
    return response.data;
});
export const userResetPasswordToken = ErrorHandler(async (email: string): Promise<ResponseMessage> => {
    const response = await axios.post(`/api/user/password-reset/token?email=${email}`)
    return response.data;
});
export const getReactivateOTPUser = ErrorHandler(async (email: string) : Promise<ResponseMessage> => {
    const response = await axios.get(`/api/user/reactivate?email=${email}`)
    return response.data;
});
export const reactivateUser = ErrorHandler(async (creds: Record<string,any>,code: string): Promise<ResponseMessage> => {
    const response = await axios.patch(`/api/user/reactivate?code=${code}`,creds);
   return response.data
});
export const deactivateUser = ErrorHandler(async (): Promise<ResponseMessage> => {
    const token:string = await getCookie();
    const response = await axios.patch(`/api/user/deactivate`,{},{headers:
        {
          'Authorization': `Bearer ${token}`
        }
       });
   return response.data
});
export const deleteUser = ErrorHandler(async (): Promise<ResponseMessage> => {
    const token:string = await getCookie();
    const response = await axios.delete(`/api/user`,{headers:
        {
          'Authorization': `Bearer ${token}`
        }
       });
   return response.data
});
//cookie
export const getCookie = ErrorHandler(async (): Promise<string>  => {
    const response = await axios.get('/api/access-token')
    return response.data?.data?.token
})
export const logoutApi = ErrorHandler(async (): Promise<ResponseMessage>  => {
    const response = await axios.get('/api/logout')
    return response.data
})