import { Table } from '@mantine/core';

import { isHashRouter } from '@/core/features/router/config';
import {
  DISABLE_WALLET_SIGN,
  SIGN_TIMEOUT_IN_SEC,
  SLOW_DOWN_IN_MS,
  POST_LOGIN_REDIRECT_PATH,
} from '@/domain/features/wallet/config';

export const Environment = () => {
  return (
    <Table variant="vertical" layout="fixed" captionSide="top">
      <Table.Caption>Environment Variables</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th w={160}>Mode</Table.Th>
          <Table.Td>{import.meta.env.MODE}</Table.Td>
          <Table.Td>Check</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Use Hash Router</Table.Th>
          <Table.Td>{import.meta.env.VITE_ROUTER_USE_HASH}</Table.Td>
          <Table.Td>{`${isHashRouter}`}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Wallet: Disable Sign</Table.Th>
          <Table.Td> {import.meta.env.VITE_WALLET_DISABLE_SIGN}</Table.Td>
          <Table.Td> {`${DISABLE_WALLET_SIGN}`}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Wallet: Sign Timeout</Table.Th>
          <Table.Td>{import.meta.env.VITE_WALLET_SIGN_TIMEOUT_IN_SEC}</Table.Td>
          <Table.Td>{`${SIGN_TIMEOUT_IN_SEC}`}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Wallet: Slow Down</Table.Th>
          <Table.Td>{import.meta.env.VITE_WALLET_SLOW_DOWN_IN_MS}</Table.Td>
          <Table.Td>{`${SLOW_DOWN_IN_MS}`}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Login Redirect</Table.Th>
          <Table.Td>{import.meta.env.VITE_POST_LOGIN_REDIRECT_PATH}</Table.Td>
          <Table.Td>{`${POST_LOGIN_REDIRECT_PATH}`}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
