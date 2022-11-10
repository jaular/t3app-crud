import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

const Header = () => {
  const { classes } = useStyles();
  return (
    <header className={`${classes.header} text-center`}>
      <h2>T3 APP - CRUD</h2>
    </header>
  );
};

export default Header;
