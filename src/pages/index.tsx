import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { Button, Anchor, ActionIcon } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons";
import { appRouter } from "~/server/router";
import { createContext } from "~/server/router/context";
import { trpc } from "~/utils/trpc";
import Container from "~/components/Container";
import Form from "~/components/Form";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const patientsQuery = trpc.useQuery(["patient.getAll"]);

  // const updatePatient = trpc.useMutation(["patient.update"], {
  //   async onSuccess() {
  //     await utils.invalidateQueries(["patient.getAll"]);
  //   },
  // });

  const deletePatient = trpc.useMutation(["patient.delete"], {
    async onSuccess() {
      await utils.invalidateQueries(["patient.getAll"]);
    },
  });

  // const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("update");
  // };

  const handleDelete = async (id: string) => {
    const input = {
      id: id,
    };
    try {
      await deletePatient.mutateAsync(input);
    } catch {}
  };

  return (
    <Container>
      {patientsQuery.data ? (
        <ul className="p-0 list-inside">
          {patientsQuery.data?.map((patient) => (
            <li key={patient.id} className="my-4">
              <Link href={`/patient/${patient.id}`} passHref>
                <Anchor component="a">
                  {patient.documentId} - {patient.firstName} {patient.lastName}
                </Anchor>
              </Link>

              <Button
                className="ml-2"
                color="red"
                size="xs"
                onClick={() => handleDelete(patient.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl font-bold">Loading..</p>
      )}

      {/* <Form onSubmit={handleSubmit} isLoading={createPatient.isLoading} />
      {createPatient && (
        <p style={{ color: "red" }}>{createPatient.error?.message}</p>
      )} */}

      <Form />
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
