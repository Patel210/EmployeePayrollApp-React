import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import profile1 from "../../assets/profile-images/Ellipse -1.png";
import profile2 from "../../assets/profile-images/Ellipse -2.png";
import profile3 from "../../assets/profile-images/Ellipse -3.png";
import profile4 from "../../assets/profile-images/Ellipse -4.png";
import deleteIcon from "../../assets/icons/delete-black-18dp.svg";
import editIcon from "../../assets/icons/create-black-18dp.svg";
import { stringifyDate } from "../PayrollForm/Utility";
import EmployeeService from "../../services/EmployeeService";
import "./display.scss";

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.employeeService = new EmployeeService();
  }

  getProfilePic = (profileUrl) => {
    let index = profileUrl.split("-")[2].split(".")[0];
    switch (index) {
      case "1":
        return profile1;
      case "2":
        return profile2;
      case "3":
        return profile3;
      case "4":
        return profile4;
    }
  };
  remove = (employeeObject) => {
    this.props.deleteEmployee(employeeObject);
  };

  update = (employeeObject) => {
    this.props.updateEmployee(employeeObject);
  };

  componentDidMount() {
    this.render();
  }

  render() {
    return (
      <table id="table-display" className="table">
        <tbody>
          <tr key={-1}>
            <th></th>
            <th>Name</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
          {this.props.employeeArray &&
            this.props.employeeArray.map((element, index) => (
              <tr key={element.id}>
                <td>
                  <img
                    className="profile"
                    alt=""
                    src={this.getProfilePic(element.profileUrl)}
                  />
                </td>
                <td>{element.name}</td>
                <td>{element.gender}</td>
                <td>
                  {element.departments &&
                    element.departments.map((department) => (
                      <div className="dept-label">{department}</div>
                    ))}
                </td>
                <td>{element.salary}</td>
                <td>{stringifyDate(element.startDate)}</td>
                <td>
                  <img
                    onClick={() => this.remove(element)}
                    alt="delete"
                    src={deleteIcon}
                  />
                  <img
                    onClick={() => this.update(element)}
                    alt="edit"
                    src={editIcon}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
}

export default withRouter(Display);
