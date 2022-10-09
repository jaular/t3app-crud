import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

const Footer = () => {
  const { classes } = useStyles();
  return (
    <footer className={`${classes.footer} text-center`}>
      <h2>Footer</h2>
    </footer>
  );
};

export default Footer;
