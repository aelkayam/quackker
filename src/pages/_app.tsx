import "~/styles/globals.css";
import { api } from "~/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import SideNav from "~/components/SideNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Quackker</title>
        <meta
          name="description"
          content="This is a twitter clone where you quack instead of tweet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex items-start font-mono sm:pr-4">
        <SideNav />
        <div className="min-h-screen flex-grow border-x">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
