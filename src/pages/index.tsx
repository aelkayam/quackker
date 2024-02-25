import { NextPage } from "next";
import { NewQuackForm } from "~/components/NewQuackForm";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2  ">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewQuackForm />
    </>
  );
};

export default Home;
