import {
  Alert,
  Card,
  Code,
  Container,
  Loader,
  MantineProvider,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMemo } from "react";
import { IconSearch, IconAlertCircle } from "@tabler/icons";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { AccountsApi, Configuration } from "@stacks/blockchain-api-client";

enum Net {
  Devnet = "http://localhost:3999",
  Testnet = "https://stacks-node-api.testnet.stacks.co",
  Mainnet = "https://stacks-node-api.mainnet.stacks.co",
}

const AppWithoutProviders = () => {
  const form = useForm({
    initialValues: {
      net: Net.Testnet,
      principal: "",
    },

    validate: {
      // NOTE: Would be great to have a unit test for this function
      principal: (value: string) =>
        value.length === 41
          ? null
          : "Invalid principal. Please check the address of the principal you want to inspect.",
    },
  });

  const config = useMemo(
    () => new Configuration({ basePath: form.values.net }),
    [form.values.net]
  );
  // const nftsApi = useMemo(
  //   () => new NonFungibleTokensApi(config),
  //   // () => new NonFungibleTokensApi(),
  //   [form.values.net]
  // );
  const accountsApi = useMemo(() => new AccountsApi(config), [form.values.net]);

  // const nftsQuery = useQuery(
  //   ["nfts", form.values.principal],
  //   () => nftsApi.getNftHoldings({ principal: form.values.principal }),
  //   {
  //     enabled: false,
  //   }
  // );
  const balancesQuery = useQuery<
    { non_fungible_tokens: { [key: string]: unknown } },
    string
  >(
    ["balances", form.values.net, form.values.principal],
    // () => {
    //   return (async () => {
    //     try {
    //       return accountsApi.getAccountBalance({
    //         principal: form.values.principal,
    //       });
    //     } catch (res) {
    //       const error = (await (res as Response).json()).error;
    //       throw error;
    //     }
    //   })();
    // },
    async () => {
      try {
        const res = await accountsApi.getAccountBalance({
          principal: form.values.principal,
        });
        return res;
      } catch (err) {
        const error = (await (err as Response).json()).error;
        throw error;
      }
    },
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
            // nftsQuery.refetch();
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
                {Object.keys(balancesQuery.data.non_fungible_tokens).map(
                  (k) => (
                    <Card shadow="xs" key={k}>
                      <Text weight={700}>{k.split("::")[1]}</Text>
                      <Code>{k}</Code>
                    </Card>
                  )
                )}
              </Stack>
            </Container>
          </>
        )}
      </Stack>
    </>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <AppWithoutProviders />
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}

export default App;
