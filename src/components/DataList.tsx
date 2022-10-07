import type { PatientProps } from "~/lib/types";
import Link from "next/link";
import { ActionIcon, Anchor, Group, List } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons";

type Props = {
  data: PatientProps[] | undefined;
  onUpdate: (patient: PatientProps) => void;
  onDelete: (documentId: string) => Promise<void>;
};

const DataList = ({ data, onUpdate, onDelete }: Props) => {
  return (
    <>
      {data?.length ? (
        <List>
          {data?.map((item) => (
            <List.Item key={item.documentId} className="my-4">
              <Group>
                <Link href={`/patient/${item.documentId}`} passHref>
                  <Anchor component="a">
                    {item.documentId} - {item.firstName} {item.lastName}
                  </Anchor>
                </Link>
                <Group spacing="xs">
                  <ActionIcon
                    color="gray"
                    size={32}
                    variant="light"
                    onClick={() => onUpdate(item)}
                  >
                    <IconPencil size={18} stroke={1.5} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    size={32}
                    variant="light"
                    onClick={() => onDelete(item.documentId)}
                  >
                    <IconTrash size={18} stroke={1.5} />
                  </ActionIcon>
                </Group>
              </Group>
            </List.Item>
          ))}
        </List>
      ) : (
        <p className="text-2xl font-bold">There is no data.</p>
      )}
    </>
  );
};

export default DataList;
