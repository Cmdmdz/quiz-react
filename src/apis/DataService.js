import http from "./HttpService"

export const findAllByLastDay = () => {
    return http.get(`historical?lastdays=30`)
}