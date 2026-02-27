import {
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

export default function RestrictSearchV4() {
  const restrictSearchModalDisclosure = useDisclosure();
  const modalSize = useBreakpointValue({ base: "full", md: "lg" });

  return null; // ishraq: component not ready for use yet

  return (
    <>
      <button
        onClick={restrictSearchModalDisclosure.onOpen}
        className="text-xs font-bold text-pink-500 hover:text-pink-700 transition-colors duration-200 ease-in-out focus:outline-none"
      >
        Restrict Search
      </button>
      <Modal {...restrictSearchModalDisclosure} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-base p-4 py-8">
              <div className="flex flex-col space-y-4">
                <span className="font-bold">Restrict search to attributes</span>
                <div className="flex flex-col space-y-2">
                  {[
                    "None",
                    "Job Title",
                    "Similar Job Title",
                    "Requirements",
                    "Tech",
                  ].map((item) => (
                    <Checkbox key={item} size="md" colorScheme="pink">
                      {item}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
