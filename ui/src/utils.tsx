
const HOST = process.env.REACT_APP_API_HOST;
const PORT = process.env.REACT_APP_API_PORT;

export const APIURI:string = `http://${HOST}:${PORT}`;


export const getAPIURIWithPath = (rest:Array<string>):string=> `${APIURI}/${rest.join('/')}`;