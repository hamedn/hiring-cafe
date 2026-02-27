import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const AccordionItem = ({ title, content, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="accordion-flush" className="">
      <h2 id="accordion-flush-heading-1" className="">
        <button
          type="button"
          className="flex items-center justify-between space-x-4 w-full py-5 text-left border-b border-gray-200 md:text-2xl font-normal"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="accordion-flush-body-1"
        >
          <span>{title}</span>
          {isOpen ? (
            <ChevronUpIcon className="flex-none w-6 h-6" />
          ) : (
            <ChevronDownIcon className="flex-none w-6 h-6" />
          )}
        </button>
      </h2>
      {isOpen && (
        <div
          id="accordion-flush-body-1"
          aria-labelledby="accordion-flush-heading-1"
        >
          <div className="py-5 border-b border-gray-200">
            <p className="text-gray-600 text-sm md:text-lg">{content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Accordion = ({ items }) => {
  return (
    <>
      <div className="flex flex-col space-y-2 w-full">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </>
  );
};

export default Accordion;
