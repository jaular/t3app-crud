import type { PatientProps } from "~/lib/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  createStyles,
  Table,
  ScrollArea,
  Group,
  ActionIcon,
  Anchor,
  UnstyledButton,
  Text,
  Center,
  TextInput,
} from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

type Props = {
  data: PatientProps[];
  onUpdate: (patient: PatientProps) => void;
  onDelete: (documentId: string) => Promise<void>;
};

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: PatientProps[], search: string) {
  const query = search.toLowerCase().trim();

  return data.filter(
    (item) =>
      item.documentId.toLowerCase().includes(query) ||
      item.firstName.toLowerCase().includes(query) ||
      item.lastName.toLowerCase().includes(query)
  );
}

function sortData(
  data: PatientProps[],
  payload: {
    sortBy: keyof PatientProps | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const TableList = ({ data, onUpdate, onDelete }: Props) => {
  const { classes, cx } = useStyles();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof PatientProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: keyof PatientProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const rows = sortedData.map((row) => (
    <tr key={row.documentId}>
      <td>
        <Link href={`/patient/${row.documentId}`} passHref>
          <Anchor component="a">{row.documentId}</Anchor>
        </Link>
      </td>
      <td>
        {row.firstName} {row.lastName}
      </td>
      <td>{row.email}</td>
      <td>
        <Group>
          <ActionIcon
            color="gray"
            size={32}
            variant="light"
            onClick={() => onUpdate(row)}
          >
            <IconPencil size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            color="red"
            size={32}
            variant="light"
            onClick={() => onDelete(row.documentId)}
          >
            <IconTrash size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      <TextInput
        placeholder="Search by document id or name"
        mb="lg"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        autoComplete="off"
        onChange={handleSearchChange}
      />

      <ScrollArea
        sx={{ height: 250 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "fixed", minWidth: 700 }}
          highlightOnHover
        >
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <Th
                sorted={sortBy === "documentId"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("documentId")}
              >
                Document ID
              </Th>
              <Th
                sorted={sortBy === "firstName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("firstName")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={4}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default TableList;
