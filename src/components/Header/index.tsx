import MenuList from "@/ui/MenuList";
import ToggleButtons from "@/ui/ToggleButtons";
import { Box, Divider } from "@mui/material";
import React from "react";
import { networks } from "./networks";

interface HeaderProps {
  accounts: string[];
  selectedAccount: string;
  chainId: string;
  refreshAccountData: (account: string) => void;
  switchChain: (chain: string) => void;
}

const Header = ({
  accounts,
  selectedAccount,
  refreshAccountData,
  chainId,
  switchChain,
}: HeaderProps) => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems="center"
      p={1}
    >
      <MenuList
        options={accounts}
        selectedItem={selectedAccount}
        onChange={refreshAccountData}
      />
      <Divider
        flexItem
        sx={{ display: { xs: "block", md: "none" }, mb: 2, mt: 1 }}
      />
      <ToggleButtons
        selectedItem={chainId}
        options={networks}
        onChange={switchChain}
      ></ToggleButtons>
    </Box>
  );
};

export default Header;
