import useURLSearchStateV4, {
  URLSearchStateUpdateType,
} from "@/hooks/useURLSearchStateV4";
import {
  Checkbox,
  Input,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  IconButton,
  Collapse,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  HStack,
  Spacer,
  Flex,
  Text,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiChevronsDown,
  FiChevronsUp,
} from "react-icons/fi";
import { useCurrentSearchFilters } from "contexts/CurrentSearchFiltersContext";
import { useState, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const categories = {
  Technology: [
    "Engineering",
    "Software Development",
    "Information Technology",
    "Data and Analytics",
  ],
  "Design and Creative": ["Design", "Creative and Art Services"],
  "Business Operations": [
    "Project and Program Management",
    "Product Management",
    "Business Operations",
    "Legal and Compliance",
    "Finance and Accounting",
    "Human Resources",
    "Administrative & Clerical Support",
  ],
  "Sales and Marketing": [
    "Sales",
    "Marketing",
    "Communications and Public Affairs",
    "Business Development",
  ],
  Healthcare: [
    "Healthcare Services - Advanced Practice",
    "Healthcare Services - Allied Health",
    "Healthcare Services - Nursing",
    "Healthcare Services - Pharmacy",
    "Healthcare Services - Veterinary",
  ],
  Education: ["Education services"],
  "Customer and Social Services": ["Customer Service", "Social Services"],
  "Skilled Trades - Construction, Mechanical, Repair, Labor, etc": [
    "Skilled Trades - Construction",
    "Skilled Trades - Mechanical and Electrical",
    "Skilled Trades - Manufacturing and Industrial",
    "Skilled Trades - Maintenance and Repair",
    "Skilled Trades - General Labor",
  ],
  "Transportation and Logistics": [
    "Transportation Services",
    "Supply Chain / Logistics / Procurement",
  ],
  "Quality and Safety": [
    "Quality Assurance",
    "Environment, Health, and Safety",
  ],
  "Research and Development": ["Research and Development (R&D)"],
  "Food and Hospitality": ["Food and Beverage Services"],
  "Protective Services": ["Protective Services"],
  "Custodial Services": ["Custodial Services"],
};

export default function JobCategorySelectionV5() {
  const { state: currentSearchState } = useCurrentSearchFilters();
  const { update } = useURLSearchStateV4();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(categories)
  );

  const handleCheckboxChange = (dept) => {
    let newDepartments = [...(currentSearchState.departments || [])];
    if (newDepartments.includes(dept)) {
      newDepartments = newDepartments.filter((d) => d !== dept);
    } else {
      newDepartments.push(dept);
    }
    update({
      type: URLSearchStateUpdateType.DEPARTMENTS,
      payload: newDepartments,
    });
  };

  const handleCategoryToggle = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(
        expandedCategories.filter((cat) => cat !== category)
      );
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const handleTagRemove = (dept) => {
    let newDepartments = currentSearchState.departments.filter(
      (d) => d !== dept
    );
    update({
      type: URLSearchStateUpdateType.DEPARTMENTS,
      payload: newDepartments,
    });
  };

  const handleExpandAll = () => {
    setExpandedCategories(Object.keys(filteredCategories));
  };

  const handleCollapseAll = () => {
    setExpandedCategories([]);
  };

  const filteredCategories = useMemo(() => {
    let result = {};
    if (searchTerm.trim() !== "") {
      Object.entries(categories).forEach(([category, depts]) => {
        const categoryMatch = category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchingDepts = depts.filter((dept) =>
          dept.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (categoryMatch) {
          result[category] = depts;
        } else if (matchingDepts.length > 0) {
          result[category] = matchingDepts;
        }
      });
    } else {
      result = categories;
    }
    return result;
  }, [searchTerm]);

  return (
    <div className="space-y-2 pb-16 bg-white p-4">
      <div className="flex flex-col space-y-4 sticky top-0 bg-white z-10 pb-2 border-b">
        <Flex alignItems="center" wrap="wrap">
          <InputGroup size="sm" maxW="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              focusBorderColor="pink.500"
            />
            {searchTerm && (
              <InputRightElement>
                <button
                  className="bg-gray-600 p-0.5 rounded-full text-white"
                  onClick={() => setSearchTerm("")}
                >
                  <XMarkIcon className="h-3 w-3 flex-none" />
                </button>
              </InputRightElement>
            )}
          </InputGroup>
          <Spacer />
          <HStack spacing={2} mt={{ base: 2, md: 0 }}>
            <Button
              size="sm"
              onClick={handleExpandAll}
              leftIcon={<FiChevronsDown />}
              variant="outline"
              className="bg-white"
            >
              Expand All
            </Button>
            <Button
              size="sm"
              onClick={handleCollapseAll}
              leftIcon={<FiChevronsUp />}
              variant="outline"
              className="bg-white"
            >
              Collapse All
            </Button>
          </HStack>
        </Flex>
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
          {currentSearchState.departments?.map((dept) => (
            <div key={dept} className="flex-none">
              <Tag
                size="sm"
                borderRadius="full"
                variant="solid"
                bg="pink.500"
                color="white"
              >
                <TagLabel>{dept}</TagLabel>
                <TagCloseButton onClick={() => handleTagRemove(dept)} />
              </Tag>
            </div>
          ))}
        </div>
      </div>
      <div>
        {Object.entries(filteredCategories).map(([category, depts]) => {
          const selectedDeptsInCategory = depts.filter((dept) =>
            currentSearchState.departments?.includes(dept)
          );
          const isExpanded =
            expandedCategories.includes(category) || searchTerm.trim() !== "";
          return (
            <Box key={category} borderBottom="1px solid #e2e8f0">
              <Flex alignItems="center" justifyContent="space-between" py={2}>
                <Flex alignItems="center">
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    ml={2}
                    cursor="pointer"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Text>
                  {selectedDeptsInCategory.length > 0 && (
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      ml={2}
                    >{`(${selectedDeptsInCategory.length}/${depts.length})`}</Text>
                  )}
                </Flex>
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  aria-label="Toggle Category"
                  onClick={() => handleCategoryToggle(category)}
                />
              </Flex>
              <Collapse in={isExpanded}>
                <Box pl={6} pb={2}>
                  {depts.map((dept) => (
                    <Box key={dept} py={1}>
                      <Checkbox
                        size="sm"
                        isChecked={currentSearchState.departments?.includes(
                          dept
                        )}
                        onChange={() => handleCheckboxChange(dept)}
                        colorScheme="pink"
                      >
                        {dept}
                      </Checkbox>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </div>
    </div>
  );
}
