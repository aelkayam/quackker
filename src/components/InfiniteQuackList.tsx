import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";

type Quack = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string };
};

type InfiniteQuackListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewQuacks: () => Promise<unknown>;
  quacks?: Quack[];
};

export function InfiniteQuackList({
  quacks,
  isError,
  isLoading,
  hasMore,
  fetchNewQuacks,
}: InfiniteQuackListProps) {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;

  if (quacks == null || quacks.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Quacks</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={quacks.length}
        next={fetchNewQuacks}
        hasMore={hasMore}
        loader={"Loading infinite scroll..."}
      >
        {quacks.map((quack) => {
          return <QuackCard key={quack.id} {...quack} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function QuackCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Quack) {
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton likedByMe={likedByMe} likeCount={likeCount} />
      </div>
    </li>
  );
}

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
};

function HeartButton({ likedByMe, likeCount }: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status != "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <div className="mb-1 mt-1 flex items-center gap-3 self-start text-yellow-700">
      <HeartIcon />
      <span>{likeCount}</span>
    </div>
  );
}
