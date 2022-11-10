import { createStyles, Text, Anchor } from "@mantine/core";

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
      <Text className="my-4" size="sm">
        Built by{" "}
        <Anchor href="https://github.com/jaular" target="_blank" underline>
          jaular
        </Anchor>
      </Text>
    </footer>
  );
};

export default Footer;
