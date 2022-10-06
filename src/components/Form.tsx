import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { TextInput, Select, Button } from "@mantine/core";
import { trpc } from "~/utils/trpc";

const schema = z.object({
  documentId: z
    .string()
    .min(7, { message: "Document ID should have at least 7 letters" })
    .max(8, { message: "Max 8 letters" }),
  firstName: z
    .string()
    .min(2, { message: "First name should have at least 2 letters" })
    .max(30, { message: "Max 30 letters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name should have at least 2 letters" })
    .max(30, { message: "Max 30 letters" }),
  gender: z.string().min(2, { message: "Pick one" }),
});

type ValuesProps = {
  documentId: string;
  firstName: string;
  lastName: string;
  gender: string;
};

const Form = () => {
  const utils = trpc.useContext();

  const createPatient = trpc.useMutation(["patient.create"], {
    async onSuccess() {
      await utils.invalidateQueries(["patient.getAll"]);
    },
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      documentId: "",
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

  const handleSubmit = async (values: ValuesProps) => {
    try {
      await createPatient.mutateAsync(values);
      form.reset();
    } catch {}
  };

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        autoComplete="off"
      >
        <div className="grid grid-cols-3 gap-4">
          <TextInput
            label="Document ID"
            placeholder="Document ID"
            withAsterisk
            {...form.getInputProps("documentId")}
          />
          <TextInput
            label="First name"
            placeholder="First name"
            withAsterisk
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last name"
            placeholder="Last name"
            withAsterisk
            {...form.getInputProps("lastName")}
          />
          <Select
            label="Gender"
            placeholder="Pick one"
            data={["Male", "Female", "Other"]}
            {...form.getInputProps("gender")}
          />
        </div>
        <Button type="submit" disabled={createPatient.isLoading}>
          Submit
        </Button>
      </form>
    </>
  );
};

export default Form;
