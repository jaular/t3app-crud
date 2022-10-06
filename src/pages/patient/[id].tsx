import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { createSSGHelpers } from "@trpc/react/ssg";
import superjson from "superjson";
import { appRouter } from "~/server/router";
import { createContext } from "~/server/router/context";
import { prisma } from "~/server/db/client";
import { trpc } from "~/utils/trpc";
import Container from "~/components/Container";

const UserPage: NextPage = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const userQuery = trpc.useQuery(["patient.byId", { id }]);
  return (
    <Container title={`Paciente - ${id}`}>
      {userQuery.data ? (
        <>
          <h1>{userQuery.data.id}</h1>
          <em>
            Created {userQuery.data.createdAt.toLocaleDateString("en-us")}
          </em>
          <p>Raw data:</p>
          <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>
        </>
      ) : (
        <h1>No user with id: {id}</h1>
      )}
      <Link href="/">Back to home</Link>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
    },
  });

  const paths = patients.map((patient) => ({
    params: {
      id: patient.id,
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

  const patient = await ssg.fetchQuery("patient.byId", { id });

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
