import React from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import profile1 from "../../assets/profile-images/Ellipse -1.png";
import profile2 from "../../assets/profile-images/Ellipse -2.png";
import profile3 from "../../assets/profile-images/Ellipse -3.png";
import profile4 from "../../assets/profile-images/Ellipse -4.png";
import "./payrollForm.scss";
import Header from "../Header/Header";
import { stringifyDate, checkName, checkStartDate } from "./Utility.js";
import EmployeeService from "../../services/EmployeeService";

class PayrollForm extends React.Component {
  constructor(props) {
    super(props);

    this.departmentArray = [];
    this.employeeService = new EmployeeService();
    this.isUpdate = false;
    this.employeePayrollObject = {};
    this.profileRef1 = React.createRef();
    this.profileRef2 = React.createRef();
    this.profileRef3 = React.createRef();
    this.profileRef4 = React.createRef();
    this.genderRefMale = React.createRef();
    this.genderRefFemale = React.createRef();
    this.departmentRef1 = React.createRef();
    this.departmentRef2 = React.createRef();
    this.departmentRef3 = React.createRef();
    this.departmentRef4 = React.createRef();
    this.departmentRef5 = React.createRef();
    this.state = {
      id: "",
      name: "",
      profileUrl: "",
      gender: "",
      departments: [],
      salary: 300000,
      day: 0,
      month: 0,
      year: 0,
      notes: "",
      nameError: "",
      dateError: "",
      departmentError: "",
    };
  }

  handleRadio = (profile) => {
    this.setState({ [profile.target.name]: profile.target.value });
  };

  handleCheckBox = (element) => {
    if (!element.target.checked) {
      let index = this.departmentArray.indexOf(element.target.value);
      this.departmentArray.splice(index, 1);
    } else {
      if (!this.departmentArray.includes(element.target.value)) {
        this.departmentArray.push(element.target.value);
      }
      this.setState({ departmentError: "" });
    }
    this.setState({ [element.target.name]: this.departmentArray });
  };

  handleInputChange = (element) => {
    this.setState({
      [element.target.id]: element.target.value,
    });

    if (element.target.id == "name") {
      try {
        checkName(element.target.value);
        this.setState({ nameError: "" });
      } catch (error) {
        this.setState({ nameError: error });
      }

      if (element.target.value == "") {
        this.setState({ nameError: "" });
      }
    }

    if (element.target.id == "day") {
      if (
        element.target.value != 0 &&
        this.state.month != 0 &&
        this.state.year != 0
      ) {
        try {
          checkStartDate(
            new Date(
              this.state.year,
              this.state.month - 1,
              element.target.value
            )
          );
          this.setState({ dateError: "" });
        } catch (error) {
          this.setState({ dateError: error });
        }
      }
    }

    if (element.target.id == "month") {
      if (
        element.target.value != 0 &&
        this.state.day != 0 &&
        this.state.year != 0
      ) {
        try {
          checkStartDate(
            new Date(this.state.year, element.target.value - 1, this.state.day)
          );
          this.setState({ dateError: "" });
        } catch (error) {
          this.setState({ dateError: error });
        }
      }
    }

    if (element.target.id == "year") {
      if (
        element.target.value != 0 &&
        this.state.month != 0 &&
        this.state.day != 0
      ) {
        try {
          checkStartDate(
            new Date(element.target.value, this.state.month - 1, this.state.day)
          );
          this.setState({ dateError: "" });
        } catch (error) {
          this.setState({ dateError: error });
        }
      }
    }
  };

  validData = (data) => {
    let isValid = true;
    if (data.nameError !== "") {
      isValid = false;
    }

    if (data.dateError !== "") {
      isValid = false;
    }

    if (data.day == 0 || data.month == 0 || data.year == 0) {
      this.setState({
        dateError: "Please Select the Date!",
      });
      isValid = false;
    }

    if (data.departments.length != 0) {
    } else {
      this.setState({
        departmentError: "Please Select Atleast One Department!",
      });
      isValid = false;
    }

    return isValid;
  };

  save = async (event) => {
    event.preventDefault();

    if (!this.validData(this.state)) {
      console.log("Error Present");
      return;
    }

    this.employeePayrollObject = {
      id: this.state.id,
      name: this.state.name,
      gender: this.state.gender,
      departments: this.state.departments,
      salary: this.state.salary,
      startDate: stringifyDate(
        new Date(this.state.year, this.state.month - 1, this.state.day)
      ),
      notes: this.state.notes,
      profileUrl: this.state.profileUrl,
    };
    if (this.isUpdate) {
      this.employeeService
        .updateEmployee(this.employeePayrollObject)
        .then((data) => console.log("Data Updated Successfully"))
        .catch((error) =>
          console.log("Error Encountered while Updating the Data!")
        );
    } else {
      this.employeeService
        .addEmployee(this.employeePayrollObject)
        .then((data) => console.log("Data Added Successfully"))
        .catch((error) =>
          console.log("Error Encountered while Adding the Data!")
        );
    }
    this.reset();
    this.props.history.push(`/home-page`);
  };

  reset = () => {
    this.setState({
      name: "",
      profileUrl: "",
      gender: "",
      departments: [],
      salary: 300000,
      day: 0,
      month: 0,
      year: 0,
      notes: "",
      nameError: "",
      dateError: "",
      departmentError: "",
    });
    this.resetGender();
    this.resetDepartments();
    this.resetProfileUrl();
  };

  componentDidMount() {
    this.checkIsUpdate();
  }

  checkIsUpdate = () => {
    let employeePayrollJson = localStorage.getItem("editEmp");
    this.isUpdate = employeePayrollJson ? true : false;
    if (!this.isUpdate) {
      return;
    }
    this.employeePayrollObject = JSON.parse(employeePayrollJson);
    this.setForm();
  };

  setForm = () => {
    let date = stringifyDate(this.employeePayrollObject.startDate).split(" ");
    let month = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(date[1]);
    this.setGender(this.employeePayrollObject.gender);
    this.setProfileUrl(this.employeePayrollObject.profileUrl);
    this.setDepartment(this.employeePayrollObject.departments);
    this.setState({
      id: this.employeePayrollObject.id,
      name: this.employeePayrollObject.name,
      profileUrl: this.employeePayrollObject.profileUrl,
      gender: this.employeePayrollObject.gender,
      departments: this.employeePayrollObject.departments,
      salary: this.employeePayrollObject.salary,
      day: date[0],
      month: month,
      year: date[2],
      notes: this.employeePayrollObject.notes,
    });
    console.log(this.state.notes);
    this.departmentArray = this.employeePayrollObject.departments;
  };

  setProfileUrl = (profileUrl) => {
    if (this.profileRef1.current.value == profileUrl) {
      this.profileRef1.current.checked = true;
    }
    if (this.profileRef2.current.value == profileUrl) {
      this.profileRef2.current.checked = true;
    }
    if (this.profileRef3.current.value == profileUrl) {
      this.profileRef3.current.checked = true;
    }
    if (this.profileRef4.current.value == profileUrl) {
      this.profileRef4.current.checked = true;
    }
  };

  setGender = (gender) => {
    if (this.genderRefMale.current.value === gender) {
      this.genderRefMale.current.checked = true;
    } else {
      this.genderRefFemale.current.checked = true;
    }
  };

  setDepartment = (departments) => {
    if (departments.includes(this.departmentRef1.current.value)) {
      this.departmentRef1.current.checked = true;
    }
    if (departments.includes(this.departmentRef2.current.value)) {
      this.departmentRef2.current.checked = true;
    }
    if (departments.includes(this.departmentRef3.current.value)) {
      this.departmentRef3.current.checked = true;
    }
    if (departments.includes(this.departmentRef4.current.value)) {
      this.departmentRef4.current.checked = true;
    }
    if (departments.includes(this.departmentRef5.current.value)) {
      this.departmentRef5.current.checked = true;
    }
  };

  resetProfileUrl = () => {
    this.profileRef1.current.checked = false;
    this.profileRef2.current.checked = false;
    this.profileRef3.current.checked = false;
    this.profileRef4.current.checked = false;
  };

  resetGender = () => {
    this.genderRefMale.current.checked = false;
    this.genderRefFemale.current.checked = false;
  };

  resetDepartments = () => {
    this.departmentRef1.current.checked = false;
    this.departmentRef2.current.checked = false;
    this.departmentRef3.current.checked = false;
    this.departmentRef4.current.checked = false;
    this.departmentRef5.current.checked = false;
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="form-content">
          <form
            className="form"
            action="#"
            onSubmit={this.save}
            onReset={this.reset}
          >
            <div className="form-head">
              <strong>Employee Payroll Form</strong>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="name">
                Name
              </label>
              <input
                className="input"
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
                placeholder="Enter Your Name"
                required
              />
              <error-output
                className="text-error"
                id="name-error"
                htmlFor="text"
                value={this.state.nameError}
              >
                {this.state.nameError}
              </error-output>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="profile">
                Profile Image
              </label>
              <div className="profile-radio-content">
                <label>
                  <input
                    type="radio"
                    id="profile1"
                    name="profileUrl"
                    value="../../assets/profile-images/Ellipse -1.png"
                    onChange={this.handleRadio}
                    ref={this.profileRef1}
                    required
                  />
                  <img className="profile" id="image1" src={profile1} />
                </label>
                <label>
                  <input
                    type="radio"
                    id="profile2"
                    name="profileUrl"
                    value="../../assets/profile-images/Ellipse -2.png"
                    onChange={this.handleRadio}
                    ref={this.profileRef2}
                    required
                  />
                  <img className="profile" id="image2" src={profile2} />
                </label>
                <label>
                  <input
                    type="radio"
                    id="profile3"
                    name="profileUrl"
                    value="../../assets/profile-images/Ellipse -3.png"
                    onChange={this.handleRadio}
                    ref={this.profileRef3}
                    required
                  />
                  <img className="profile" id="image3" src={profile3} />
                </label>
                <label>
                  <input
                    type="radio"
                    id="profile4"
                    name="profileUrl"
                    value="../../assets/profile-images/Ellipse -4.png"
                    onChange={this.handleRadio}
                    ref={this.profileRef4}
                    required
                  />
                  <img className="profile" id="image4" src={profile4} />
                </label>
              </div>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="gender">
                Gender
              </label>
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  onChange={this.handleRadio}
                  ref={this.genderRefMale}
                  required
                />
                <label htmlFor="male" className="text">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  onChange={this.handleRadio}
                  ref={this.genderRefFemale}
                  required
                />
                <label htmlFor="female" className="text">
                  Female
                </label>
              </div>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="department">
                Department
              </label>
              <div>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="hr"
                  name="departments"
                  value="HR"
                  onChange={this.handleCheckBox}
                  ref={this.departmentRef1}
                />
                <label className="text" htmlFor="hr">
                  HR
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="sales"
                  name="departments"
                  value="Sales"
                  onChange={this.handleCheckBox}
                  ref={this.departmentRef2}
                />
                <label className="text" htmlFor="sales">
                  Sales
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="finance"
                  name="departments"
                  value="Finance"
                  onChange={this.handleCheckBox}
                  ref={this.departmentRef3}
                />
                <label className="text" htmlFor="finance">
                  Finance
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="engineer"
                  name="departments"
                  value="Engineer"
                  onChange={this.handleCheckBox}
                  ref={this.departmentRef4}
                />
                <label className="text" htmlFor="engineer">
                  Engineer
                </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  id="others"
                  name="departments"
                  value="Others"
                  onChange={this.handleCheckBox}
                  ref={this.departmentRef5}
                />
                <label className="text" htmlFor="others">
                  Others
                </label>
              </div>
              <error-output
                className="text-error"
                id="name-error"
                htmlFor="text"
                value={this.state.departmentError}
              >
                {this.state.departmentError}
              </error-output>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="salary">
                Salary
              </label>
              <input
                className="slider"
                type="range"
                name="salary"
                id="salary"
                min="100000"
                max="500000"
                step="10000"
                value={this.state.salary}
                onChange={this.handleInputChange}
              />
              <output className="salary-output text" htmlFor="salary">
                {this.state.salary}
              </output>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="startdate">
                Start Date
              </label>
              <div id="date" htmlFor="startdate" name="startDate">
                <select
                  id="day"
                  name="Day"
                  value={this.state.day}
                  onChange={this.handleInputChange}
                >
                  <option value="0">Day</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>
                <select
                  id="month"
                  name="Month"
                  value={this.state.month}
                  onChange={this.handleInputChange}
                >
                  <option value="0">Month</option>
                  <option value="1">January</option>
                  <option value="2">Febuary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  id="year"
                  name="Year"
                  value={this.state.year}
                  onChange={this.handleInputChange}
                >
                  <option value="0">Year</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                </select>
              </div>
              <error-output
                className="date-error"
                id="date-error"
                htmlFor="startdate"
                value={this.state.dateError}
              >
                {this.state.dateError}
              </error-output>
            </div>
            <div className="row-content">
              <label className="label text" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                className="input"
                name="notes"
                placeholder=""
                onChange={this.handleInputChange}
                value={this.state.notes}
              >
                {this.state.notes}
              </textarea>
            </div>
            <div className="buttonParent">
              <Link to="home-page" className="resetButton button cancelButton">
                Cancel
              </Link>
              <div className="submit-reset">
                <button
                  type="submit"
                  className="button submitButton"
                  id="submitButton"
                >
                  Submit
                </button>
                <button type="reset" className="resetButton button">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(PayrollForm);
