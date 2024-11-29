import {
  FormLabel,
  FormHelperText,
  Input,
  FormControl,
  Button,
  Box,
  GridItem,
  Grid,
  Flex,
  Heading,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addBudget, fetchBudget } from "../reducers/makeBudgetSlice";
import type { AppDispatch, RootState } from "../store";

export type MakeBudgetType = {
  totalBudget: number;
  purpose: string;
  id?: string;
  uid: string;
};

export const MakeBudget = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<MakeBudgetType>({
    mode: "onChange",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  ///budget fetch
  useEffect(() => {
    dispatch(fetchBudget(user?.uid)).then((result) => {
      console.log("Fetch purpose budget:", result);
    });
  }, []);
  const { budget } = useSelector((state: RootState) => state.budget);

  const onSubmit: SubmitHandler<MakeBudgetType> = (data) => {
    if (budget.some((budgetData) => budgetData.purpose === data.purpose)) {
      onOpen();
      return;
    }
    dispatch(addBudget({ ...data, uid: user.uid }));
    router.push("/viewExpenses");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Purpose already exists, Please click below to add/view existing
              purpose
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                background="purple.600"
                color="white"
                variant="solid"
                type="submit"
                mt="20px"
                textAlign={"center"}
                ref={cancelRef}
                onClick={() => {
                  router.push("/viewExpenses");
                  onClose();
                }}
              >
                Expenses
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box display="flex" flexDirection={"column"} margin={"10px"}>
        {/* <Heading as="h4" size={"md"}>
          Budget Tracker
        </Heading> */}
        <Box
          display="flex"
          flexDirection={"column"}
          margin={"15px"}
          padding="10px"
        >
          <FormControl>
            <FormLabel>Custom purpose</FormLabel>
            <Input
              id="purpose"
              {...register("purpose", {
                required: true,
              })}
            />
            <FormHelperText>
              Enter a specific purpose (e.g., "Monthly saving goals,Trip to
              India etc")
            </FormHelperText>
          </FormControl>
          <FormControl marginTop={"15px"}>
            <FormLabel>Total budget</FormLabel>
            <Input
              id="totalBudget"
              {...register("totalBudget", { required: true })}
            />
            <FormHelperText>Please enter total budget</FormHelperText>
          </FormControl>
        </Box>

        <Grid gridRowGap="1rem" my={8}>
          <GridItem gridColumn="1/-1">
            <Flex justifyContent="flex-end" mt={24}>
              <Button
                background="purple.600"
                color="white"
                variant="solid"
                type="submit"
                mt="20px"
                textAlign={"center"}
                disabled={!isValid || isOpen}
              >
                Proceed Further
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </form>
  );
};
