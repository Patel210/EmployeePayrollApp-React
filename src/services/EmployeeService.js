import config from '../config/Config'
import AxiosService from './AxiosService'

class EmployeeService {
    baseUrl = config.baseUrl
    addEmployee(data) {
        return AxiosService.postService(`${this.baseUrl}employee`, data)
    }
    getAllEmployee() {
        return AxiosService.getAllEmployeeService( `${this.baseUrl}employee`)
    } 
} 
 
export default EmployeeService;