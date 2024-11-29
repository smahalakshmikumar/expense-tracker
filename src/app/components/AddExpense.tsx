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
  Select,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../reducers/expenseSlice";
import { fetchBudget } from "../reducers/makeBudgetSlice";
import type { AppDispatch } from "../store";
import { RootState } from "../store";

export type AddExpenseType = {
  date: Date;
  expenseDescription: string;
  expenseAmount: number;
  budgetPurpose?: string;
  id?: string;
  uid: string;
};

export const AddExpense = ({onClose}:{onClose: () => void}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AddExpenseType>({
    mode: "onChange",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { user, status, error } = useSelector((state: RootState) => state.auth);

  // const purpose = watch("purpose");

  const {
    budget,
    loading: budgetLoading,
    error: budgetError,
  } = useSelector((state: RootState) => state.budget);
  // const filteredBudget =
  //   budget &&
  //   budget.filter(
  //     (data, index, arr) =>
  //       arr.findIndex((obj) => obj.purpose === data.purpose) === index
  //   );
  // console.log(filteredBudget);
  useEffect(() => {
    dispatch(fetchBudget(user?.uid)).then((result) => {
      console.log("Fetch purpose budget:", result);
    });
  }, []);

  const onSubmit: SubmitHandler<AddExpenseType> = (data) => {
    dispatch(addExpense({ ...data, uid: user.uid }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection={"column"} margin={"10px"} pl="20px">
        {/* <Heading as="h4" size={"lg"}>
          Budget Tracker
        </Heading> */}
        <FormControl margin="10px">
          <FormLabel>Choose purpose</FormLabel>
          <Select
            id="purpose"
            {...register("budgetPurpose", { required: true })}
          >
            {budget.map((data, index) => (
              <option key={index} value={data.purpose}>
                {data.purpose}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* {purpose === "custom" && (
          <Box display="flex" flexDirection={"row"}>
            <FormControl margin={"10px"}>
              <FormLabel>Custom Purpose</FormLabel>
              <Input
                id="customPurpose"
                {...register("customPurpose", { required: true })}
              />
              <FormHelperText>
                Enter a specific purpose (e.g., "India Trip")
              </FormHelperText>
            </FormControl>
            <FormControl margin={"10px"}>
              <FormLabel>Total Budget</FormLabel>
              <Input
                id="customTotalBudget"
                {...register("customTotalBudget", { required: true })}
              />
              <FormHelperText>
                Enter total Budget for this custom expense
              </FormHelperText>
            </FormControl>
          </Box>
        )} */}

        <FormControl margin={"10px"}>
          <FormLabel>Date</FormLabel>
          <Input
            id="date"
            type="Date"
            {...register("date", { required: true })}
          />
          <FormHelperText>Date of Expense</FormHelperText>
        </FormControl>

        <FormControl margin={"10px"}>
          <FormLabel>Expense Description</FormLabel>
          <Input
            id="expenseDescription"
            type="text"
            {...register("expenseDescription", { required: true })}
          />
          {errors.expenseDescription && <span>This field is required</span>}
          <FormHelperText>What type of expense did you make?</FormHelperText>
        </FormControl>

        <FormControl margin={"10px"}>
          <FormLabel>Expense Amount</FormLabel>
          <Input
            id="expenseAmount"
            type="number"
            {...register("expenseAmount", { required: true })}
          />
          {errors.expenseAmount && <span>This field is required</span>}
          <FormHelperText>Please enter the amount spent</FormHelperText>
        </FormControl>

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
                disabled={!isValid}
              >
                Submit Expense
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </form>
  );
};
