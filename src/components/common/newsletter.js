import React from "react";
import Section from "./section";
import { Button } from "./index";

function Newsletter() {
  return (
    <Section extend="mt-0">
      <div className="bg-green-500 px-8 py-12 rounded-lg">
        <div class="text-white">
          <h3>Don't want to miss a post?</h3>
          <p>
            Join my personal email list and get notified for new posts and fresh
            thoughts.
          </p>
        </div>
        <div className="flex flex-wrap items-end -mx-2 overflow-hidden">
          <label className="my-2 px-2 md:w-1/4">
            <span className="text-xl text-neutral-50">First Name</span>
            <input
              class="bg-white focus:outline-none text-gray-800 focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal w-full"
              type="text"
              placeholder="Hans"
            ></input>
          </label>
          <label className="my-2 px-2 md:w-1/2">
            <span className="text-xl text-neutral-50">E-Mail</span>
            <input
              className="bg-white focus:outline-none text-gray-800  focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block appearance-none leading-normal w-full"
              type="email"
              placeholder="hansdown@gmail.com"
            ></input>
          </label>
          <div className="my-4 md:my-2 px-2 w-full md:w-1/4">
            <Button
              text="Subscribe"
              to="test"
              extend="w-full bg-white text-green-700"
            ></Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Newsletter;
