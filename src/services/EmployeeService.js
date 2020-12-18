import config from '../config/Config'
import AxiosService from './AxiosService'

class EmployeeService {
    baseUrl = config.baseUrl
    addEmployee(data) {
        return AxiosService.postService(`${this.baseURL}employee/`, data)
    } 
} 
 
export default EmployeeService;