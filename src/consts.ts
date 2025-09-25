export const API = "http://localhost:8000"
export const howShouldLog: { [key: string]: string | null } = {
    default: 'Unknown error',
    'network': 'Network error (try checking your internet connection)',
    'response': 'Server sent invalid response (website may be down)',
    'data': 'Provided data was propably invalid(try inputting it again or relogging)',
}