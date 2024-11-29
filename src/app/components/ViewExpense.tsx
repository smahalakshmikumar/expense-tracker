import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Box,
  FormControl,
  FormLabel,
  Select,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import type { AppDispatch } from "../store";
import { fetchAllExpenses } from "../reducers/expenseSlice";
import { useEffect, useState } from "react";
import { AddExpense } from "./AddExpense";
import { fetchBudget } from "../reducers/makeBudgetSlice";

export const ViewExpenses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPurpose, setSelectedPurpose] = useState("all");

  const { allExpenses, loading, error } = useSelector(
    (state: RootState) => state.expenses
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const filteredAllExpenses =
    allExpenses &&
    allExpenses.filter(
      (data, index, arr) =>
        arr.findIndex((obj) => obj.budgetPurpose === data.budgetPurpose) ===
        index
    );

  useEffect(() => {
    dispatch(fetchAllExpenses(user?.uid)).then((result) => {
      console.log("Fetch all the expenses:", result);
    });
  }, [dispatch]);

  // Filtered expenses
  const filteredExpenses =
    selectedPurpose === "all"
      ? allExpenses
      : allExpenses.filter((item) => item.budgetPurpose === selectedPurpose);

  const totalExpense = allExpenses
    .filter(
      (item) =>
        selectedPurpose === "all" || item.budgetPurpose === selectedPurpose
    )
    .reduce((acc, curr) => acc + curr.expenseAmount, 0);

  ///budget fetch
  useEffect(() => {
    dispatch(fetchBudget(user?.uid)).then((result) => {
      console.log("Fetch purpose budget:", result);
    });
  }, []);
  const { budget } = useSelector((state: RootState) => state.budget);
  const totalBudget = budget.filter(
    (data) => data.purpose === selectedPurpose
  )[0]?.totalBudget;

  if (loading === "pending") return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box padding="20px" bg="gray.50" minHeight="100vh">
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "stretch", md: "center" }}
        marginBottom="20px"
        gap="10px"
      >
        <Button
          background="purple.600"
          color="white"
          variant="solid"
          onClick={onOpen}
          width={{ base: "100%", md: "auto" }}
        >
          Add New Expense
        </Button>
        <FormControl width={{ base: "100%", md: "40%" }}>
          <FormLabel>Filter by Purpose</FormLabel>
          <Select
            id="purpose"
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
          >
            <option value="all">All</option>
            {filteredAllExpenses.map((data, index) => (
              <option key={index} value={data.budgetPurpose}>
                {data.budgetPurpose}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedPurpose !== "all" && (
        <Box
          p={5}
          boxShadow="md"
          borderRadius="md"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          mb={5}
        >
          <Heading size="md" mb={3} color="purple.600">
            Expense Summary
          </Heading>
          <Text fontSize="sm" color="gray.800">
            Total Budget: {totalBudget || 0} EUR
          </Text>
          <Text fontSize="sm" color="red.500">
            Total Spent: {totalExpense} EUR
          </Text>
          <Text fontSize="sm" color="green.500">
            Available Balance: {(totalBudget || 0) - totalExpense} EUR
          </Text>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody padding="20px">
            <AddExpense onClose={onClose}/>
          </ModalBody>
        </ModalContent>
      </Modal>

      <TableContainer
        marginTop="20px"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
        boxShadow="sm"
      >
        <Table size="md" variant="striped" colorScheme="purple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>Amount</Th>
              <Th>Purpose</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredExpenses.map((item, index) => (
              <Tr key={index}>
                <Td>{new Date(item.date).toLocaleDateString()}</Td>
                <Td>{item.expenseDescription}</Td>
                <Td isNumeric>{item.expenseAmount} EUR</Td>
                <Td>{item.budgetPurpose}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
