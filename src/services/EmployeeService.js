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
    updateEmployee(data) {
        return AxiosService.updateEmployeeService(`${this.baseUrl}employee/${data.id}`, data)
    }
    removeEmployee(id) {
        return AxiosService.removeEmployeeService(`${this.baseUrl}employee/${id}`)
    }
} 
 
export default EmployeeService;