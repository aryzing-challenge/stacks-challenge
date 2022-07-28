import {
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
import { useState } from "react";
import { IconSearch } from "@tabler/icons";

enum Net {
  Testnet = "TESTNET",
  Mainnet = "MAINNET",
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

  const [isLoading, setIsLoading] = useState(false);

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
          onSubmit={form.onSubmit(async (values) => {
            console.log(values);
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1_000));
            setIsLoading(false);
            console.log("results");
          })}
        >
          <Stack>
            <Container>
              <SegmentedControl
                value={form.values.net}
                onChange={(val: Net) => form.setFieldValue("net", val)}
                data={[
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
                rightSection={isLoading ? <Loader size="xs" /> : null}
                {...form.getInputProps("principal")}
              />
            </Container>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

function App() {
  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppWithoutProviders />
      </MantineProvider>
    </>
  );
}

export default App;
