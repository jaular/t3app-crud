import type { GetStaticProps, NextPage } from "next";
import type { PatientProps } from "~/lib/types";
import { useState } from "react";
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/router";
import { createContext } from "~/server/router/context";
import { trpc } from "~/utils/trpc";
import { patientSchema } from "~/lib/schemas";
import { patientInitialValues } from "~/lib/data";
import { Modal, Button, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import Container from "~/components/Container";
import TableList from "~/components/TableList";
import Form from "~/components/Form";

const Home: NextPage = () => {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const utils = trpc.useContext();
  const { data, isSuccess } = trpc.useQuery(["patient.getAll"]);

  const createPatient = trpc.useMutation(["patient.create"], {
    async onSuccess() {
      await utils.invalidateQueries(["patient.getAll"]);
    },
  });

  const updatePatient = trpc.useMutation(["patient.update"], {
    async onSuccess() {
      await utils.invalidateQueries(["patient.getAll"]);
    },
  });

  const deletePatient = trpc.useMutation(["patient.delete"], {
    async onSuccess() {
      await utils.invalidateQueries(["patient.getAll"]);
    },
  });

  const form = useForm({
    validate: zodResolver(patientSchema),
    initialValues: patientInitialValues,
  });

  const handleReset = () => {
    form.reset();
    setCreateState(true);
    setFormModalOpened(false);
  };

  const handleSubmit = async (patient: PatientProps) => {
    try {
      if (createState) {
        await createPatient.mutateAsync(patient);
      } else {
        await updatePatient.mutateAsync(patient);
      }
      handleReset();
    } catch {}
  };

  const handleUpdate = (patient: PatientProps) => {
    Object.entries(patient).forEach(([key, value]) => {
      form.setFieldValue(key, value);
    });
    setCreateState(false);
    setFormModalOpened(true);
  };

  const handleDelete = async (documentId: string) => {
    const input = { documentId };
    try {
      await deletePatient.mutateAsync(input);
      handleReset();
    } catch {}
  };

  return (
    <Container>
      <Modal
        centered
        overlayBlur={3}
        size={useMediaQuery("(max-width: 1200px)") ? "100%" : "80%"}
        title={<h2 className="m-0">{createState ? "Create" : "Update"}</h2>}
        opened={formModalOpened}
        onClose={() => handleReset()}
      >
        <Form
          form={form}
          createState={createState}
          createPatient={createPatient.isLoading}
          updatePatient={updatePatient.isLoading}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </Modal>

      <TableList
        data={isSuccess ? data : []}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <Group position="center" className="mt-8">
        <Button variant="default" onClick={() => setFormModalOpened(true)}>
          Add new record
        </Button>
      </Group>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.fetchQuery("patient.getAll");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

export default Home;
