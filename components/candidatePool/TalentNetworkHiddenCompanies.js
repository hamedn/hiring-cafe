import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const TalentNetworkHiddenCompanies = ({
  companyDomains,
  setCompanyDomains,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem) {
      setCompanyDomains([...companyDomains, newItem]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = companyDomains.filter((_, i) => i !== index);
    setCompanyDomains(updatedItems);
  };

  return (
    <div className="">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 w-full"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Email domain name (e.g. meta.com)"
        />
        <button
          disabled={!newItem}
          className={`p-2 rounded bg-black text-white disabled:text-black focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed`}
          onClick={handleAddItem}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <ul>
        {companyDomains.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 border-b border-gray-300"
          >
            <div className="flex items-center">
              <span className="text-gray-400 font-light">*@</span>
              <span className="font-medium mr-1">{item}</span>
              <Popover isLazy closeOnBlur={true} closeOnEsc={true} wid>
                <PopoverTrigger>
                  <button>
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <span>{`Your profile will be hidden from emails ending with ${item}. For example: lisa@${item}`}</span>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </div>
            <button onClick={() => handleRemoveItem(index)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TalentNetworkHiddenCompanies;
