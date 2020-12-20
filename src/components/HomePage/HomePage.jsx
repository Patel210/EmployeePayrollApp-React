import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import addIcon from "../../assets/icons/add-24px.svg";
import EmployeeService from "../../services/EmployeeService";
import Display from "../Display/Display";
import Header from "../Header/Header";
import "./homePage.scss";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: [],
      count: 0,
    };
    this.employeeService = new EmployeeService();
  }

  getEmployeeList = () => {
    this.employeeService
      .getAllEmployee()
      .then((data) => {
        console.log("Data Added Successfully", data.data);
        this.setState({ employeeList: data.data, count: data.data.length });
      })
      .catch((error) => console.log("Error Encountered!"));
  };

  remove = (employeePayrollData) => {
    const index = this.state.employeeList.indexOf(employeePayrollData);
    let list = this.state.employeeList;
    list.splice(index, 1);
    this.setState({ employeeList: list, count: list.length });

    this.employeeService
      .removeEmployee(employeePayrollData.id)
      .then((data) => console.log("Data Removed Successfully"))
      .catch((error) =>
        console.log("Error Encountered while Deleting the Data!")
      );
  };

  update = (employeePayrollData) => {
    localStorage.setItem("editEmp", JSON.stringify(employeePayrollData));
    this.props.history.push(`/payroll-form`);
  };

  componentDidMount() {
    localStorage.removeItem("editEmp");
    this.getEmployeeList();
  }

  render() {
    return (
      <div>
        <Header />
        <div className="main-content">
          <div className="header-content">
            <div className="emp-detail-text">
              Employee Details{" "}
              <div className="emp-count">{this.state.count}</div>
            </div>
            <Link to="payroll-form" className="add-button">
              <img src={addIcon} alt="" />
              Add User
            </Link>
          </div>
          <div className="table-main">
            <Display
              updateEmployee={this.update}
              deleteEmployee={this.remove}
              employeeArray={this.state.employeeList}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
