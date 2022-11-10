import type { UseFormReturnType } from "@mantine/form";
import type { PatientProps } from "~/lib/types";
import {
  Button,
  Select,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  Divider,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/es";
import moment from "moment";
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
  // const [id, setId] = useState<string | undefined>(form.values.id);
  const age = moment().diff(
    { ...form.getInputProps("birthDate") }.value,
    "years"
  );

  return (
    <>
      <form
        className="space-y-8"
        onSubmit={form.onSubmit((values) => onSubmit(values))}
        // onSubmit={form.onSubmit((values) => console.log(values))}
        autoComplete="off"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {/* <TextInput
            label="ID"
            placeholder="Auto-Generated ID"
            value={id}
            onChange={() => setId(id)}
            disabled
          /> */}
          <TextInput
            label="Document ID"
            placeholder="Document ID"
            disabled={!createState}
            withAsterisk
            {...form.getInputProps("documentId")}
          />
          <div className="grid grid-cols-3 gap-1">
            <DatePicker
              className="col-span-2"
              locale="es"
              placeholder="Birth date"
              label="Birth date"
              withAsterisk
              {...form.getInputProps("birthDate")}
            />
            <NumberInput
              disabled
              placeholder="Age"
              label="Age"
              value={isNaN(age) ? 0 : age >= 0 ? age : 0}
            />
          </div>
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
            placeholder="Gender"
            data={["Male", "Female", "Other"]}
            withAsterisk
            {...form.getInputProps("gender")}
          />
          <TextInput
            label="Address"
            placeholder="Address"
            {...form.getInputProps("address")}
          />
          <TextInput
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <TextInput
            component={InputMask}
            mask="+58 (999) 999-9999"
            label="Phone number"
            placeholder="Phone number"
            {...form.getInputProps("phoneNumber")}
          />
          <TextInput
            label="Occupation"
            placeholder="Occupation"
            {...form.getInputProps("occupation")}
          />
          <Divider
            my="xs"
            label="Advance options"
            labelPosition="center"
            className="col-span-2 md:col-span-3 xl:col-span-4"
          />
          <Checkbox.Group
            className="col-span-2 md:col-span-3 xl:col-span-4"
            label="Habits"
            {...form.getInputProps("habits")}
          >
            <Checkbox value="CF" label="CF" />
            <Checkbox value="ALH" label="ALH" />
            <Checkbox value="CG" label="CG" />
            <Checkbox value="DRG" label="DRG" />
          </Checkbox.Group>
          <Checkbox.Group
            className="col-span-2 md:col-span-3 xl:col-span-4"
            label="Personal medical history"
            {...form.getInputProps("personalMedicalHistory")}
          >
            <Checkbox value="HTA" label="HTA" />
            <Checkbox value="DM1" label="DM1" />
            <Checkbox value="DM2" label="DM2" />
            <Checkbox value="AB" label="AB" />
            <Checkbox value="EPOC" label="EPOC" />
            <Checkbox value="TB" label="TB" />
            <Checkbox value="CA" label="CA" />
            <Checkbox value="VIH" label="VIH" />
            <Checkbox value="FQ" label="FQ" />
            <Checkbox value="ECV" label="ECV" />
            <Checkbox value="TIR" label="TIR" />
            <Checkbox value="Other" label="Other" />
          </Checkbox.Group>
        </div>
        <Group>
          <Button type="submit" disabled={createPatient || updatePatient}>
            Submit
          </Button>
          <Button
            variant="default"
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
