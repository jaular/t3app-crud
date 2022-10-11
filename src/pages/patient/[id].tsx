import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
// tRPC
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/router";
import { createContext } from "~/server/router/context";
import { prisma } from "~/server/db/client";
import { trpc } from "~/utils/trpc";
// Mantine
import { Anchor } from "@mantine/core";
// Components
import Container from "~/components/Container";
import Chart from "~/components/Chart";

const UserPage: NextPage = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const userQuery = trpc.useQuery(["patient.byId", { documentId: id }]);
  return (
    <Container title={`Patient - ${id}`}>
      {userQuery.data ? (
        <>
          <h1>{userQuery.data.documentId}</h1>
          <em>
            Created {userQuery.data.createdAt.toLocaleDateString("es-ES")}
          </em>
          <p>Raw data:</p>
          <pre className="p-4 bg-gray-800 rounded">
            {JSON.stringify(userQuery.data, null, 2)}
          </pre>
        </>
      ) : (
        <h1>No patient with Document ID: {id}</h1>
      )}
      <Link href="/" passHref>
        <Anchor component="a">Back to home</Anchor>
      </Link>
      {/* <div className="mt-8">
        <Chart />
      </div> */}
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const patients = await prisma.patient.findMany({
    select: {
      documentId: true,
    },
  });

  const paths = patients.map((patient) => ({
    params: {
      id: patient.documentId,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id = "" } = params as { id: string };

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const patient = await ssg.fetchQuery("patient.byId", { documentId: id });

  if (!patient) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export default UserPage;
