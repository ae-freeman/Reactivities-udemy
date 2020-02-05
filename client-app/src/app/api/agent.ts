import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { history } from "../.."; //if a file is called index.tsx is doesn't need to be named
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";

// This is the connection file to the api. 

// all the other requests will go on the end of this url
axios.defaults.baseURL = "http://localhost:5000/api";

// This is for the login token so the app remembers someone is logged in each time they go to a new page. 
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
}, error => {
    return Promise.reject(error);
})

// Error returns
axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running');
    }
    const {status, data, config} = error.response;
    if (error.response.status === 404) {
        history.push("/notfound");
    }
    if (status === 400 && config.method === "get" && data.errors.hasOwnProperty('id')) {
        history.push('/notfound')
    }

    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }

    throw error.response;
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

// Type of request, this gets added on to the base url, then used in Activities below. 
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}

// The Activity Store uses these properties inside the Actitivities object
const Activities = {
    list: (): Promise<IActivity[]> => requests.get("/activities"),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post("/activities", activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.del(`/activities/${id}/attend`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user),
}

export default {
    Activities,
    User
}