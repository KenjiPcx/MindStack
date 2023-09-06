import { Footer, Center, Text } from "@mantine/core";

const AppFooter = () => {
  return (
    <Footer height={50} px="md" py="sm">
      <Center>
        <Text size="sm" color="dimmed">
          @ Phyciex Labs - 2023
        </Text>
      </Center>
    </Footer>
  );
};

export default AppFooter;
