"use client";
import Header from "@/components/Header";
import { useSyncProviders } from "@/hooks/useSyncProviders";
import { formatBalance, formatToWei } from "@/lib/format";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { center } from "./styles";
import { TESTNET_CHAIN_ID } from "@/components/Header/networks";
import TransactionForm, { FormState } from "@/components/TransactionForm";
import { useSnackbar, VariantType } from "notistack";

const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");

  const providers = useSyncProviders();

  const isNotConnected = providers.length > 0 && !selectedAccount;
  const isConnected = providers.length > 0 && selectedAccount;
  const isNoProvider = providers.length < 1;

  const handleConnect = async () => {
    try {
      const accounts: any = await providers[0].provider.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.[0]) {
        setAccounts(accounts);
        refreshAccountData(accounts[0]);
      }
    } catch (error: any) {
      handleShowSnackbar(error.message, "error");
    }
  };

  async function getAccounts() {
    try {
      const accounts: any = await providers[0].provider.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccounts(accounts);
        refreshAccountData(accounts[0]);
      } else {
        handleShowSnackbar("Accounts are not connected", "error");
      }
    } catch (error: any) {
      handleShowSnackbar(error.message, "error");
    }
  }

  async function refreshAccountData(account: string) {
    try {
      const balance = formatBalance(
        await providers[0]?.provider.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        })
      );
      const chainId: any = await providers[0]?.provider.request({
        method: "eth_chainId",
      });

      setSelectedAccount(account);
      setBalance(balance);
      setChainId(chainId);
    } catch (error: any) {
      handleShowSnackbar(error.message, "error");
    }
  }

  async function switchChain(chainId: string) {
    try {
      await providers[0].provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      refreshAccountData(selectedAccount);
      handleShowSnackbar("Network successfully changed");
    } catch (switchError: any) {
      if (switchError.code === 4902 && chainId === TESTNET_CHAIN_ID) {
        try {
          await providers[0].provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: TESTNET_CHAIN_ID,
                chainName: "Тестовая сеть Sepolia",
                rpcUrls: ["https://sepolia.infura.io/v3/"],
              },
            ],
          });
          refreshAccountData(selectedAccount);
        } catch (addError: any) {
          handleShowSnackbar(addError.message, "error");
        }
      }
      handleShowSnackbar(switchError.message, "error");
    }
  }

  async function sendTransaction(
    { amount, recipientAddress }: FormState,
    reset: () => void
  ) {
    try {
      const txHash = await providers[0].provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: selectedAccount,
            to: recipientAddress,
            value: formatToWei(amount),
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      });

      const transactionInterval = setInterval(async () => {
        const transactionReceipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });

        if (transactionReceipt) {
          clearInterval(transactionInterval);
          refreshAccountData(selectedAccount);
          handleShowSnackbar(`Transaction succeeded`);
        }
      }, 500);

      reset();
      handleShowSnackbar(
        `Transaction is processing id: ${txHash}`,
        "warning",
        6000
      );
    } catch (error: any) {
      handleShowSnackbar(error.message, "error");
    }
  }

  function handleShowSnackbar(
    msg: string,
    variant: VariantType = "success",
    autoHideDuration: number = 3000
  ) {
    enqueueSnackbar(msg, { variant, autoHideDuration });
  }

  function handleAccountChanged(accounts: any) {
    refreshAccountData(accounts[0]);
  }

  useEffect(() => {
    if (providers.length > 0) {
      getAccounts();

      window.ethereum.on("accountsChanged", handleAccountChanged);
    }

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChanged);
    };
  }, [providers]);

  if (isNotConnected) {
    return (
      <Box {...center} mt={10}>
        <Button onClick={handleConnect} size="large">
          Connect Wallet
        </Button>
      </Box>
    );
  }

  if (isNoProvider) {
    return (
      <Box {...center} mt={10}>
        <Typography variant="h5">
          There are no announced providers. Please install{" "}
          <Link href="https://metamask.io/" target="_blank">
            Metamask Chrome extension
          </Link>{" "}
          first!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {isConnected ? (
        <>
          <Header
            accounts={accounts}
            selectedAccount={selectedAccount}
            refreshAccountData={refreshAccountData}
            chainId={chainId}
            switchChain={switchChain}
          />
          <Divider
            sx={{
              width: { md: "100%", xs: "100%", sm: "60%" },
              mx: "auto",
              display: { xs: "none", md: "block" },
            }}
          />
          <TransactionForm
            sendTransaction={sendTransaction}
            balance={balance}
          />
        </>
      ) : (
        <Box {...center} height={"100vh"}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
