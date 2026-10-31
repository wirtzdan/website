"use client";

import { DatePicker } from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

/** Same structure as Chakra's DatePicker.Header, with Remix chevrons. */
export function DatePickerHeader() {
  return (
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger>
        <RiArrowLeftSLine />
      </DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger>
        <DatePicker.RangeText />
      </DatePicker.ViewTrigger>
      <DatePicker.NextTrigger>
        <RiArrowRightSLine />
      </DatePicker.NextTrigger>
    </DatePicker.ViewControl>
  );
}
