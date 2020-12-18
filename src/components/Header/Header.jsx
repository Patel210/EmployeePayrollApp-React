import React, { Component } from "react";
import logo from "../../assets/images/logo.png";
import "./header.scss";

class Header extends Component {
  render() {
    return (
      <div>
        <header className="header-content header">
          <div className="logo-content">
            <img src={logo} alt="" />
            <div>
              <span className="emp-text">EMPLOYEE</span>
              <br />
              <span className="emp-text emp-payroll">PAYROLL</span>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
