import React, { Component } from "react";

import { Moon, Sun } from "react-feather";

export default class ThemeToggle extends Component {
  setTheme = theme => {
    const htmlSelector = document.querySelector("html");

    if (theme === "light") {
      window.localStorage.setItem("THEME", "light");
      htmlSelector.classList.remove("mode-dark");
    } else {
      window.localStorage.setItem("THEME", "dark");
      htmlSelector.classList.add("mode-dark");
    }
  };

  componentDidMount = () => {
    const theme = window.localStorage.getItem("THEME");

    if (theme) {
      this.setTheme(theme);
    }
  };

  render = () => (
    <div className="leading-0">
      <button
        className="focus:outline-none dark:hidden"
        title="Set dark theme"
        onClick={() => this.setTheme("dark")}
      >
        <Moon className="w-8 dark:hidden" />
      </button>
      <button
        className="focus:outline-none hidden dark:block"
        title="Set light theme"
        onClick={() => this.setTheme("light")}
      >
        <Sun className="w-8 " />
      </button>
    </div>
  );
}
