import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { InfiniteQuackList } from "~/components/InfiniteQuackList";
import { NewQuackForm } from "~/components/NewQuackForm";
import { api } from "~/utils/api";
import Providers from "./providers";
import ThemeSwitch from "~/components/ThemeSwitch";
import { GiDuck } from "react-icons/gi";
import Link from "next/link";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-gray-300 pt-2 dark:bg-green-950 ">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="px-4 text-lg font-bold ">
            <Link href="/">Home</Link>{" "}
          </h1>
          <GiDuck className="" size={24} />
          <div className="px-4">
            <ThemeSwitch />
          </div>
        </div>
        {session.status == "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-gray-700 dark:focus-visible:bg-gray-700
                  ${
                    tab === selectedTab
                      ? "border-b-4 border-b-yellow-400 font-bold"
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
