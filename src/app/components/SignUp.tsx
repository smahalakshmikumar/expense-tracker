"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../store";
import { registerWithEmail, signInWithGoogle } from "../reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";

export type user = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
};

const SignupCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<user>({
    mode: "onChange",
  });

  const handleGoogleSignIn = async () => {
    await dispatch(signInWithGoogle()).unwrap();
    router.push("/homePage");
  };

  const onSubmit: SubmitHandler<user> = async (data) => {
    await dispatch(registerWithEmail(data)).unwrap();
    router.push("/signIn");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bgImage="url('/expenseImage.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Expense Tracker
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      {...register("firstName", {
                        required: true,
                      })}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" {...register("lastName")} />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={5} pt={2}>
                <Button
                  background="purple.600"
                  color="white"
                  variant="solid"
                  type="submit"
                  mt="20px"
                  textAlign={"center"}
                  _hover={{
                    bg: "purple.500",
                  }}
                  isDisabled={!isValid}
                >
                  Sign up
                </Button>
                <Button
                  loadingText="Submitting"
                  background="purple.600"
                  color="white"
                  variant="solid"
                  onClick={handleGoogleSignIn}
                  mt="20px"
                  textAlign={"center"}
                  _hover={{
                    bg: "purple.500",
                  }}
                >
                  Login via Gmail
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => router.push("/signIn")}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
};

export default SignupCard;
