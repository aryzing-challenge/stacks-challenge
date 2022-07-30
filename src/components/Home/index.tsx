import {
  Alert,
  Button,
  Card,
  Code,
  Container,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMemo } from "react";
import { IconSearch, IconAlertCircle } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { AccountsApi, Configuration } from "@stacks/blockchain-api-client";
import { Net } from "./types";
import { getDataOrError, validatePrincipal } from "./utils";

export const Home = () => {
  const form = useForm({
    initialValues: {
      net: Net.Testnet,
      principal: "",
    },

    validate: {
      principal: validatePrincipal,
    },
  });

  const config = useMemo(
    () => new Configuration({ basePath: form.values.net }),
    [form.values.net]
  );

  const accountsApi = useMemo(() => new AccountsApi(config), [form.values.net]);

  const balancesQuery = useQuery<
    { non_fungible_tokens: { [key: string]: unknown } },
    string
  >(
    ["balances", form.values.net, form.values.principal],
    getDataOrError(() =>
      accountsApi.getAccountBalance({
        principal: form.values.principal,
      })
    ),
    { enabled: false, retry: false }
  );

  return (
    <>
      <Stack>
        <Container>
          <Title align="center" order={1}>
            NFT Inspector
          </Title>
          <Text align="center">
            Use the search bar below to list all NFTs belonging to a principal.
          </Text>
        </Container>
        <form
          onSubmit={form.onSubmit(() => {
            balancesQuery.refetch();
          })}
        >
          <Stack>
            <Container>
              <SegmentedControl
                value={form.values.net}
                onChange={(val: Net) => form.setFieldValue("net", val)}
                data={[
                  {
                    label: "Devnet (localhost:3999)",
                    value: Net.Devnet,
                  },
                  {
                    label: "Testnet",
                    value: Net.Testnet,
                  },
                  {
                    label: "Mainnet",
                    value: Net.Mainnet,
                  },
                ]}
              />
            </Container>
            <Container style={{ minWidth: "41em" }}>
              <TextInput
                required
                icon={<IconSearch size={16} />}
                placeholder="Principal e.g. ST1B9E..."
                rightSection={
                  balancesQuery.isFetching ? <Loader size="xs" /> : null
                }
                {...form.getInputProps("principal")}
              />
            </Container>
            <Container>
              <Button type="submit" disabled={balancesQuery.isFetching}>
                Search NFTs
              </Button>
            </Container>
          </Stack>
        </form>
        {!balancesQuery.isFetching && balancesQuery.error && (
          <Container>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              {balancesQuery.error}
            </Alert>
          </Container>
        )}
        {!balancesQuery.isFetching && balancesQuery.data && (
          <>
            <Container>
              <Stack>
                {Object.keys(balancesQuery.data.non_fungible_tokens).length >
                0 ? (
                  Object.keys(balancesQuery.data.non_fungible_tokens).map(
                    (k) => (
                      <Card shadow="xs" key={k}>
                        <Text weight={700}>{k.split("::")[1]}</Text>
                        <Code>{k}</Code>
                      </Card>
                    )
                  )
                ) : (
                  <Card shadow="xs">
                    <Text>This principal has no NFTs.</Text>
                  </Card>
                )}
              </Stack>
            </Container>
          </>
        )}
      </Stack>
    </>
  );
};
