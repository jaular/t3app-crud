import type { UseFormReturnType } from "@mantine/form";
import type { PatientProps } from "~/lib/types";
import { Button, Select, TextInput, Group } from "@mantine/core";
import InputMask from "react-input-mask-next";

type Props = {
  form: UseFormReturnType<PatientProps>;
  onSubmit: (patient: PatientProps) => Promise<void>;
  onReset: () => void;
  createState: boolean;
  createPatient: boolean;
  updatePatient: boolean;
};

const Form = ({
  form,
  createState,
  createPatient,
  updatePatient,
  onSubmit,
  onReset,
}: Props) => {
  return (
    <>
      <form
        className="space-y-8"
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        autoComplete="off"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-8">
          <TextInput
            label="Document ID"
            placeholder="Document ID"
            disabled={!createState}
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
            withAsterisk
            {...form.getInputProps("gender")}
          />
          <TextInput
            label="Email"
            placeholder="Email"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <TextInput
            component={InputMask}
            mask="+58 (999) 999-9999"
            label="Phone number"
            placeholder="Phone number"
            withAsterisk
            {...form.getInputProps("phoneNumber")}
          />
        </div>
        <Group>
          <Button type="submit" disabled={createPatient || updatePatient}>
            Submit
          </Button>
          <Button
            color="red"
            onClick={() => {
              onReset();
            }}
          >
            Cancel
          </Button>
        </Group>
      </form>
    </>
  );
};

export default Form;
