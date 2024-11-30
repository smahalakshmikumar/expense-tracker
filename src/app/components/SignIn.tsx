"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { signInWithEmail } from "../reducers/authSlice";
import { useForm, SubmitHandler } from "react-hook-form";

export type user = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
  } = useForm<user>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<user> = async (data) => {
    await dispatch(signInWithEmail(data)).unwrap();
    router.push("/homePage");
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
            <Heading fontSize={"4xl"}>Expense Tracker</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w={{ base: "full", sm: "sm", md: "md" }}
          >
            <Stack spacing={4} >
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("password", { required: true })}
                />
              </FormControl>
              <Stack spacing={10}>
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
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
};
export default SignIn;
