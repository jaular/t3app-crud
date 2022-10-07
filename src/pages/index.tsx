import type { GetStaticProps, NextPage } from "next";
import type { PatientProps } from "~/lib/types";
import { useState } from "react";
// tRPC
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/router";
import { createContext } from "~/server/router/context";
import { trpc } from "~/utils/trpc";
// Lib
import { patientSchema } from "~/lib/schemas";
import { patientInitialValues } from "~/lib/data";
// Mantine
import { useForm, zodResolver } from "@mantine/form";
// Components
import Container from "~/components/Container";
import DataList from "~/components/DataList";
import Form from "~/components/Form";

const Home: NextPage = () => {
  const [createState, createSetState] = useState<boolean>(true);

  const utils = trpc.useContext();
  const patientsQuery = trpc.useQuery(["patient.getAll"]);

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
    createSetState(true);
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
    createSetState(false);
    Object.entries(patient).forEach(([key, value]) => {
      form.setFieldValue(key, value);
    });
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
      <DataList
        data={patientsQuery.data}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <h1>{createState ? "Create" : "Update"}</h1>

      <Form
        form={form}
        createState={createState}
        createPatient={createPatient.isLoading}
        updatePatient={updatePatient.isLoading}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
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
