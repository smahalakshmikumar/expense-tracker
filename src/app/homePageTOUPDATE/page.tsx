"use client";
import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
} from "@chakra-ui/react";
import { MakeBudget } from "../components/MakeBudget";
import { ViewExpenses } from "../components/ViewExpense";
import { useRouter } from "next/navigation";
import { signOutUser } from "../reducers/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    await dispatch(signOutUser()).unwrap();
    router.push("/");
  };

  return (
    <Tabs>
      <Flex justify="space-between" align="center" p={2}>
        <TabList>
          <Tab>Make Budget Plan</Tab>
          <Tab>View Expenses</Tab>
        </TabList>
        <Button colorScheme="red" onClick={handleSignOut} size="sm" ml={4}>
          Sign out
        </Button>
      </Flex>

      <TabPanels>
        <TabPanel>
          <MakeBudget />
        </TabPanel>
        <TabPanel>
          <ViewExpenses />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Home;
