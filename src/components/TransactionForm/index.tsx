import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

export interface FormState {
  recipientAddress: string;
  amount: string;
}

interface TransactionFormProps {
  balance: string;
  sendTransaction: (data: FormState, reset: () => void) => void;
}

const TransactionForm = ({
  sendTransaction,
  balance,
}: TransactionFormProps) => {
  const { handleSubmit, control, reset } = useForm<FormState>({
    mode: "onSubmit",
    defaultValues: {
      recipientAddress: "",
      amount: "",
    },
  });

  function onSubmit(data: FormState) {
    sendTransaction(data, reset);
  }

  return (
    <Paper
      sx={{
        p: 5,
        mb: 3,
        mt: { xs: 2, md: 3 },
        width: { sm: "60%", xs: "100%" },
        mx: "auto",
      }}
      elevation={3}
    >
      <Typography variant="h6" color="grey">
        Balance
      </Typography>
      <Typography variant="subtitle1">{balance || 0} ETH</Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <Controller
          name="recipientAddress"
          control={control}
          rules={{ required: "Please write wallet address" }}
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="recipientAddress"
              label="Recipient Address"
              autoComplete="recipientAddress"
              autoFocus
              error={invalid}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="amount"
          control={control}
          rules={{ required: "Please clarify amount" }}
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              type="number"
              id="amount"
              label="Amount"
              autoComplete="amount"
              autoFocus
              error={invalid}
              helperText={error?.message}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          endIcon={<ArrowOutwardIcon />}
          sx={{ mt: 3, mb: 2 }}
        >
          Transfer
        </Button>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
