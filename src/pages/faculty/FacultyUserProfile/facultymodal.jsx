import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import FacultyChangePassword from "./facultyChangePassword";

function FacultyModal({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [email, setEmail] = useState("");
  const [programData, setProgramData] = useState(null);
  const [facultyData, setFacultyData] = useState(null);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyId, setFacultyId] = useState("");

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const formatBirthdate = (birthdate) => {
    const date = new Date(birthdate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (facultyEmail) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/faculty/${encodeURIComponent(facultyEmail)}`
          );

          const user = response.data;
          user.birthdate = formatBirthdate(user.birthdate);

          // Set the initial state for editable fields
          setFirstName(user.faculty_fname || "");
          setMiddleName(user.faculty_mname || "");
          setLastName(user.faculty_lname || "");
          setGender(user.gender || "");
          setBirthdate(new Date(user.birthdate) || null);
          setSelectedProgram(
            (programData &&
              programData.find(
                (program) => program.program_id === user.program_id
              )?.program_name) ||
              ""
          );

          setEmail(user.email || "");

          setFacultyData(user);
          setFacultyId(user.faculty_id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [programData, facultyEmail]);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/programs");
        setProgramData(response.data);
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Call the fetchProgramData function when the component mounts
    fetchProgramData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/updatefaculty/${encodeURIComponent(
          facultyEmail
        )}`,
        {
          faculty_id: facultyId,
          faculty_fname: firstName,
          faculty_mname: middleName,
          faculty_lname: lastName,
          gender: gender,
          birthdate: new Date(birthdate).toISOString().split("T")[0],
          program_id: programData.find(
            (program) => program.program_name === selectedProgram
          )?.program_id,

          email: email,
        }
      );

      // Log the response (You might want to handle it differently)
      console.log("User data updated:", response.data);
      onClose(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };
  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody justifyContent="flex-start" alignItems="flex-start">
          <VStack spacing={2.5} alignItems="flex-start">
            <HStack gap="3rem">
              <HStack fontWeight="semibold">
                <Text>First</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.2rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="2rem">
              <HStack fontWeight="semibold">
                <Text>Middle</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.4rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="2.2rem">
              <HStack fontWeight="semibold">
                <Text>Last</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                ml="1rem"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="4rem">
              <Text fontWeight="semibold">Email:</Text>
              <Input
                ml="1.8rem"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "25rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              />
            </HStack>
            <HStack gap="4rem">
              <Text fontWeight="semibold">Gender:</Text>
              <Select
                ml="1.1rem"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: "25rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </HStack>
            <HStack gap="4rem">
              <Text fontWeight="semibold">Birthdate:</Text>
              <DatePicker
                selected={birthdate}
                onChange={(date) => setBirthdate(date)}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Birthdate"
                dateFormat="MM/dd/yyyy"
                maxDate={new Date()}
                style={{ border: "1px solid black", padding: "0.2rem" }}
              />
            </HStack>
            <HStack gap="4rem">
              <Text fontWeight="semibold">Program:</Text>
              <Select
                ml=".5rem"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                style={{
                  width: "25rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                {programData &&
                  programData.map((program) => (
                    <option
                      key={program.program_id}
                      value={program.program_name}
                    >
                      {program.program_name}
                    </option>
                  ))}
              </Select>
            </HStack>
            <Button onClick={handleOpenChangePasswordModal}>
              Change Password
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          {" "}
          <HStack spacing={4} justify="flex-end">
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
            <Button colorScheme="teal" onClick={onClose}>
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
      {isChangePasswordModalOpen && (
        <FacultyChangePassword
          isOpen={isChangePasswordModalOpen}
          onClose={handleCloseChangePasswordModal}
        />
      )}
    </Modal>
  );
}
FacultyModal.propTypes = {
  onClose: PropTypes.func,
};

export default FacultyModal;