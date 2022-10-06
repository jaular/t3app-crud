type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
};

const Form = ({ onSubmit, isLoading }: Props) => {
  return (
    <>
      <form onSubmit={onSubmit} autoComplete="off">
        <input
          type="text"
          name="documentId"
          id="documentId"
          placeholder="Document id"
        />
        <input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="First name"
        />
        <input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Last name"
        />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default Form;
