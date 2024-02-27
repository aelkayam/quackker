import { NextPage } from "next";
import { InfiniteQuackList } from "~/components/InfiniteQuackList";
import { NewQuackForm } from "~/components/NewQuackForm";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2  ">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewQuackForm />
      <RecentQuacks />
    </>
  );
};

function RecentQuacks() {
  const quacks = api.quack.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <InfiniteQuackList
      isLoading={quacks.isLoading}
      isError={quacks.isError}
      hasMore={quacks.hasNextPage}
      fetchNewQuacks={quacks.fetchNextPage}
      quacks={quacks.data?.pages.flatMap((page) => page.quacks)}
    />
  );
}

export default Home;
