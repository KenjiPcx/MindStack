import {
  useMantineTheme,
  Header,
  MediaQuery,
  Burger,
  Text,
} from "@mantine/core";

interface AppHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppHeader = ({ opened, setOpened }: AppHeaderProps) => {
  const theme = useMantineTheme();
  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text size="xl" fw="bold">
          MindStack
        </Text>
      </div>
    </Header>
  );
};

export default AppHeader;
