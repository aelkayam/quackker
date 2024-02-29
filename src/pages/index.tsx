import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { InfiniteQuackList } from "~/components/InfiniteQuackList";
import { NewQuackForm } from "~/components/NewQuackForm";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2 ">
        <h1 className="mb-2 px-4 text-lg font-bold ">Home</h1>
        {session.status == "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200
                  ${
                    tab === selectedTab
                      ? "border-b-4 border-b-yellow-500 font-bold"
                      : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <NewQuackForm />
      {selectedTab === "Recent" ? <RecentQuacks /> : <FollowingQuacks />}
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

function FollowingQuacks() {
  const quacks = api.quack.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
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
