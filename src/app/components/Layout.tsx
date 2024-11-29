"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { signOutUser } from "../reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { RootState } from "../store";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    await dispatch(signOutUser()).unwrap();
    router.push("/signIn");
  };

  return (
    <>
      <Box bg={"yellow.300"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box color="purple.600" pl={"20px"}>
              Expense Tracker
            </Box>
          </HStack>

          <Flex alignItems={"center"}>
            <Box pr={"20px"} color="purple.600">
              {user?.displayName || "Guest"}
            </Box>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={user?.photoURL || ""} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
      <Box>{children}</Box>
    </>
  );
};

export default Layout;
