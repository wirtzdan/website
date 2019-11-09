import React, { useState } from "react";
import Section from "./section";
import addToMailchimp from "gatsby-plugin-mailchimp";

function Newsletter() {
  const [state, setState] = useState({ mail: "", status: "", msg: "" });

  const handleChange = event => {
    setState({ mail: event.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    addToMailchimp(state.mail)
      .then(({ msg, result }) => {
        if (result === "success") {
          setState({ status: "success" });
          setState({ msg: msg });
          throw msg;
        }
      })
      .catch(err => {
        setState({ status: "error" });
        setState({ msg: err });
      });
  };

  return (
    <Section extend="mt-0">
      <div className="bg-green-500 p-12 rounded-lg">
        <div class="text-white measure-narrow">
          <h3>Don't want to miss a post?</h3>
          <p>
            Join my personal email list and get notified for new posts and fresh
            thoughts.
          </p>
        </div>
        <form
          className="flex flex-wrap items-end -mx-2 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <label className="my-2 w-full px-2 md:w-2/4">
            <input
              className="bg-white focus:outline-none text-neutral-600 focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal w-full"
              name="email"
              type="text"
              placeholder="me@email.com"
              onChange={handleChange}
              value={state.mail}
            ></input>
          </label>
          <div className="my-4 md:my-2 px-2 w-full md:w-1/4">
            <button
              type="submit"
              className="inline-flex items-center justify-center py-3 px-6 rounded-lg font-bold text-xl text-white h-full w-full bg-white text-green-700"
            >
              Subscribe
            </button>
          </div>
        </form>
        <div className="text-white my-4 text-base">{state.msg}</div>
      </div>
    </Section>
  );
}

export default Newsletter;
